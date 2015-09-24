package tb.angularjs.web.mapper;

import org.mapstruct.Mapper;
import tb.angularjs.model.Photo;
import tb.angularjs.web.dto.PhotoDTO;

/**
 * Mapper for the entity Photo and its DTO PhotoDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface PhotoMapper {

    PhotoDTO photoToPhotoDTO(Photo photo);

    Photo photoDTOToPhoto(PhotoDTO photoDTO);
}
