package backend.repository;

import backend.entity.Task;
import backend.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Task> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, TaskStatus status);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, TaskStatus status);

    @Query("""
            SELECT t
            FROM Task t
            WHERE t.user.id = :userId
              AND (
                    LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(COALESCE(t.description, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
                  )
            ORDER BY t.createdAt DESC
            """)
    List<Task> searchTasks(Long userId, String keyword);
}