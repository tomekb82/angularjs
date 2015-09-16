package tb.angularjs.photos.model;

import java.io.Serializable;

/**
 * Created by tomek on 16.09.15.
 */
public class Photo {

    private String name;
    private String type;
    private String description;

    public Photo(String name, String description, String type) {
        this.name = name;
        this.description = description;
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }




}
