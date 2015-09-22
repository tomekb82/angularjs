package tb.angularjs.photos.controller;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tb.angularjs.photos.dto.PhotoDTO;
import tb.angularjs.photos.mapper.PhotoMapper;
import tb.angularjs.photos.model.Photo;
import tb.angularjs.photos.repository.PhotoRepository;
import tb.angularjs.photos.util.HeaderUtil;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class PhotoController {

    private static final String template = "Photo, %s!";
    private final Logger log = LoggerFactory.getLogger(PhotoController.class);

    @Autowired
    private PhotoRepository photoRepository;

    @Autowired
    private PhotoMapper photoMapper;

    @RequestMapping(value = "/photos",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    //@Timed
    @Transactional(readOnly = true)
    public List<Photo> getAllPhotos() {
        log.info("REST request to get all Photos");
        return photoRepository.findAll();
    }

    /* DTO version */
    public List<PhotoDTO> getAllPhotos2() {
        log.info("REST request to get all Photos");
        return photoRepository.findAll().stream()
            .map(photo -> photoMapper.photoToPhotoDTO(photo))
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * GET  /photos/:id -> get the "id" photo.
     */
    @RequestMapping(value = "/photos/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    //@Timed
    public ResponseEntity<Photo> get(@PathVariable Long id) {
        log.info("REST request to get Photo : {}", id);
        return Optional.ofNullable(photoRepository.findOne(id))
                .map(photo -> new ResponseEntity<>(
                        photo,
                        HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /photos/:id -> delete the "id" photo.
     */
    @RequestMapping(value = "/photos/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    //@Timed
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.debug("REST request to delete Photo : {}", id);
        photoRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("photo", id.toString())).build();
    }


    /**
     * POST  /photos -> Create a new photo.
     */
    @RequestMapping(value = "/photos",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    //@Timed
    public ResponseEntity<Photo> create(@RequestBody Photo photo) throws URISyntaxException {
        log.info("REST request to save Photo : {}", photo);
        if (photo.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new photo cannot already have an ID").body(null);
        }

        Photo result = photoRepository.save(photo);
        return ResponseEntity.created(new URI("/api/photos/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert("photo", result.getId().toString()))
                .body(result);
    }

    /**
     * PUT  /photos -> Updates an existing photo.
     */
    @RequestMapping(value = "/photos",
            method = RequestMethod.PUT,
            produces = MediaType.APPLICATION_JSON_VALUE)
    //@Timed
    public ResponseEntity<Photo> update(@RequestBody Photo photo) throws URISyntaxException {
        log.info("REST request to update Photo : {}", photo);
        if (photo.getId() == null) {
            return create(photo);
        }
        Photo result = photoRepository.save(photo);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert("photo", photo.getId().toString()))
                .body(result);
    }

}
