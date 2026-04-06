package backend.controller;

import backend.dto.request.TaskRequest;
import backend.dto.response.TaskResponse;
import backend.enums.TaskStatus;
import backend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.createTask(request, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getTasks(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.getUserTasks(userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.updateTask(id, request, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        taskService.deleteTask(id, userDetails.getUsername());
        return ResponseEntity.ok("Task deleted successfully!");
    }

    @GetMapping("/filter")
    public ResponseEntity<List<TaskResponse>> filterTasks(
            @RequestParam TaskStatus status,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.filterByStatus(userDetails.getUsername(), status));
    }

    @GetMapping("/search")
    public ResponseEntity<List<TaskResponse>> searchTasks(
            @RequestParam String keyword,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.searchTasks(userDetails.getUsername(), keyword));
    }
}