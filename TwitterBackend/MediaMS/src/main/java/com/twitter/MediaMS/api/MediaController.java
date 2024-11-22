package com.twitter.MediaMS.api;

import com.twitter.MediaMS.collection.Media;
import com.twitter.MediaMS.dto.MediaDTO;
import com.twitter.MediaMS.exception.MediaException;
import com.twitter.MediaMS.service.MediaService;
import org.bson.types.ObjectId;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;


import java.io.IOException;


import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(value = "/api/media")
@CrossOrigin
public class MediaController {

    @Autowired
    private MediaService mediaService;

    @PostMapping("/upload")
    public ResponseEntity<List<String>> uploadMultipleFiles(@RequestParam("files") List<MultipartFile> files) throws IOException, MediaException {
        Media media = mediaService.storeMultipleMedia(files);

        String id = media.getId().toHexString();
//        return ResponseEntity.ok(id);

        // Return list of URLs for the media files
        List<String> mediaUrls = mediaService.getAllMediaUrls(media);
        return ResponseEntity.ok(mediaUrls);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<MediaDTO> getMediaById(@PathVariable String  id) throws MediaException {
//        System.out.println(id);
        MediaDTO mediaDTO = mediaService.getMediaById(new ObjectId(id));

        return new ResponseEntity<>(mediaDTO, HttpStatus.OK);
    }

    @GetMapping("/download/{fileId}")
    public ResponseEntity<InputStreamResource> getMediaFile(@PathVariable String fileId) {
        try {
            Resource resource = mediaService.getMediaFileById(new ObjectId(fileId));

            if (resource == null) {
                return ResponseEntity.notFound().build();
            }

//            MediaType contentType = MediaType.parseMediaType(resource.getMetadata.ge)

            // Return the file content as an HTTP response
            return ResponseEntity.ok()
//                    .contentType(MediaType.parseMediaType(resource.getContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(new InputStreamResource(resource.getInputStream()));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // Invalid ObjectId format
        } catch (IOException e) {
            return ResponseEntity.status(500).build(); // IO error
        }
    }



// Download media file by ID
//    @GetMapping("/downloadAll/{mediaId}")
//    public ResponseEntity<List<Resource>> getAllMediaFilesById(@PathVariable String mediaId) {
//        try {
//            List<Resource> resources = mediaService.getAllMediaFilesById(new ObjectId(mediaId));
//            if (resources == null || resources.isEmpty()) {
//                return ResponseEntity.notFound().build();
//            }
//
//            return ResponseEntity.ok()
//                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"all_media_files.zip\"") // Optional: Customize header
//                    .body(resources);
//
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().build(); // Invalid ObjectId format
//        } catch (IOException e) {
//            return ResponseEntity.status(500).build(); // IO error
//        }
//    }

    @GetMapping("/mediaUrls/{mediaId}")
    public ResponseEntity<List<String>> getAllMediaUrls(@PathVariable String mediaId) {
        Media media = mediaService.findMediaById(new ObjectId(mediaId));
        if (media == null) {
            return ResponseEntity.notFound().build();
        }

        // Return list of URLs for the media files
        List<String> mediaUrls = mediaService.getAllMediaUrls(media);
        return ResponseEntity.ok(mediaUrls);
    }





    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedia(@PathVariable String  id) throws MediaException {
        mediaService.deleteMedia(new ObjectId(id));

        return new ResponseEntity<>("Deleted successfully", HttpStatus.OK);
    }
}
