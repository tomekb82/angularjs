package tb.angularjs.photos.dto;

import javax.persistence.ElementCollection;
import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Objects;


/**
 * A DTO for the Photo entity.
 */
public class PhotoDTO implements Serializable {

    private String id;

    private String name;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    private String type;

    private String description;

    @Override
    public String toString() {
        return "PhotoDTO{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", description='" + description + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        PhotoDTO photoDTO = (PhotoDTO) o;

        if (id != null ? !id.equals(photoDTO.id) : photoDTO.id != null) return false;
        if (name != null ? !name.equals(photoDTO.name) : photoDTO.name != null) return false;
        if (type != null ? !type.equals(photoDTO.type) : photoDTO.type != null) return false;
        return !(description != null ? !description.equals(photoDTO.description) : photoDTO.description != null);

    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (type != null ? type.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        return result;
    }
}
