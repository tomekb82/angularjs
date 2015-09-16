package tb.angularjs.photos.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import tb.angularjs.photos.model.Photo;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class PhotoController {

    private static final String template = "Photo, %s!";

    @RequestMapping(value = "/photos",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    //@Timed
    //@Transactional(readOnly = true)
    public List<Photo> getAllPhotos() {
        System.out.println("PhotoController: getAllPhotos()");
        List<Photo> photos = new ArrayList<>();
        photos.add(new Photo("photo1", "private", "opis1"));
        photos.add(new Photo("photo2", "public", "opis2"));
        photos.add(new Photo("photo3", "any", "opis3"));
        return photos;
    }

}
