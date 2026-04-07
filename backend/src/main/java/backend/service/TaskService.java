package backend.service;

import backend.dto.request.TaskRequest;
import backend.dto.response.TaskResponse;
import backend.entity.Task;
import backend.entity.User;
import backend.enums.TaskStatus;
import backend.repository.TaskRepository;
import backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;

    public TaskResponse createTask(TaskRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);

        Task task = Task.builder()
                .title(validateTitle(request.getTitle()))
                .description(normalizeDescription(request.getDescription()))
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.PENDING)
                .dueDate(request.getDueDate())
                .user(user)
                .build();

        Task savedTask = taskRepository.save(task);

        activityLogService.log(
                "Created task: " + savedTask.getTitle(),
                "TASK",
                savedTask.getId(),
                userEmail
        );

        return mapToResponse(savedTask);
    }

    public TaskResponse updateTask(Long taskId, TaskRequest request, String userEmail) {
        Task task = getTaskById(taskId);

        if (!task.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new RuntimeException("Unauthorized to update this task");
        }

        if (request.getTitle() != null && !request.getTitle().trim().isBlank()) {
            task.setTitle(request.getTitle().trim());
        }

        task.setDescription(normalizeDescription(request.getDescription()));

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        task.setDueDate(request.getDueDate());

        Task updatedTask = taskRepository.save(task);

        activityLogService.log(
                "Updated task: " + updatedTask.getTitle(),
                "TASK",
                updatedTask.getId(),
                userEmail
        );

        return mapToResponse(updatedTask);
    }

    public void deleteTask(Long taskId, String userEmail) {
        Task task = getTaskById(taskId);

        if (!task.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new RuntimeException("Unauthorized to delete this task");
        }

        activityLogService.log(
                "Deleted task: " + task.getTitle(),
                "TASK",
                taskId,
                userEmail
        );

        taskRepository.delete(task);
    }

    public List<TaskResponse> getUserTasks(String userEmail) {
        User user = getUserByEmail(userEmail);

        return taskRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<TaskResponse> filterByStatus(String userEmail, TaskStatus status) {
        User user = getUserByEmail(userEmail);

        return taskRepository.findByUserIdAndStatusOrderByCreatedAtDesc(user.getId(), status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<TaskResponse> searchTasks(String userEmail, String keyword) {
        User user = getUserByEmail(userEmail);

        String cleanedKeyword = keyword == null ? "" : keyword.trim();

        if (cleanedKeyword.isBlank()) {
            return getUserTasks(userEmail);
        }

        return taskRepository.searchTasks(user.getId(), cleanedKeyword)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private User getUserByEmail(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Task getTaskById(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    private String validateTitle(String title) {
        if (title == null || title.trim().isBlank()) {
            throw new RuntimeException("Task title is required");
        }
        return title.trim();
    }

    private String normalizeDescription(String description) {
        return description == null ? null : description.trim();
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .dueDate(task.getDueDate())
                .username(task.getUser().getUsername())
                .build();
    }
}