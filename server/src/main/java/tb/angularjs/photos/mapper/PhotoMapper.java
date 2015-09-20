package tb.angularjs.photos.mapper;

import org.mapstruct.Mapper;
import tb.angularjs.photos.dto.*;
import tb.angularjs.photos.model.*;

/**
 * Mapper for the entity Photo and its DTO PhotoDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface PhotoMapper {

    PhotoDTO photoToPhotoDTO(Photo photo);

    Photo photoDTOToPhoto(PhotoDTO photoDTO);
}
