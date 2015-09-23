package tb.angularjs.photos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tb.angularjs.photos.model.Photo;

/**
 * Created by tomek on 19.09.15.
 * Spring Data JPA repository for the Photo entity.
 */
public interface PhotoRepository extends JpaRepository<Photo,Long> {
}
