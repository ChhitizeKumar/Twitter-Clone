package com.twitter.MediaMS.service;



import com.mongodb.client.gridfs.model.GridFSFile;
import com.twitter.MediaMS.collection.Media;
import com.twitter.MediaMS.dto.MediaDTO;
import com.twitter.MediaMS.exception.MediaException;
import com.twitter.MediaMS.repository.MediaRepository;
import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MediaServiceImpl implements MediaService{

    @Autowired
    private MediaRepository mediaRepository;

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @Autowired
    private ModelMapper modelMapper;

    public Media storeMultipleMedia(List<MultipartFile> files) throws MediaException, IOException {
        List<String> filenames = new ArrayList<>();
        List<String> contentTypes = new ArrayList<>();
        List<Long> sizes = new ArrayList<>();
        List<ObjectId> gridIds = new ArrayList<>();

        for (MultipartFile file : files) {
            // Store the file in GridFS
            ObjectId gridId = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(), file.getContentType());

            // Populate lists with file metadata
            filenames.add(file.getOriginalFilename());

            contentTypes.add(file.getContentType());
//            System.out.println(file.getResource().getURL());
            sizes.add(file.getSize());
            gridIds.add(gridId);
        }

        // Create a Media object with metadata for all files in the request
        Media media = new Media(filenames, contentTypes, sizes, gridIds);

        // Save metadata to MongoDB
        return mediaRepository.save(media);
    }

    public MediaDTO getMediaById(ObjectId id) throws MediaException {
        Optional<Media> media = mediaRepository.findById(id);

        if(media.isEmpty())
            throw new MediaException("No media exist with this id");

        Media mediaNew = media.get();

        GridFSFile gridFSFile = gridFsTemplate.findOne(new Query(Criteria.where("_id")));

        System.out.println(gridFSFile);

        return modelMapper.map(mediaNew, MediaDTO.class);
    }

    @Override
    public Media findMediaById(ObjectId id) {
        return mediaRepository.findById(id).orElse(null);
    }



    // Get all media files by their GridFS IDs
    @Override
    public List<Resource> getAllMediaFilesById(ObjectId mediaId) throws IOException {
        Media media = findMediaById(mediaId);
        if (media == null) {
            return null;
        }

        List<ObjectId> gridFsIds = media.getGridFsIds();
        System.out.println(gridFsIds);
        List<Resource> resources = new ArrayList<>();

        for (ObjectId gridFsId : gridFsIds) {
            GridFSFile gridFsFile = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(gridFsId)));
            if (gridFsFile != null) {
                GridFsResource resource = gridFsTemplate.getResource(gridFsFile);
                resources.add(resource);
            }
        }

        return resources;
    }


    public void deleteMedia(ObjectId id) throws MediaException {
//        Optional<Media> media = mediaRepository.findById(id);
//
//        if(media.isEmpty())
//            throw new MediaException("No media exist with this id");

        mediaRepository.deleteById(id);
    }


    // Get URLs for media files to serve on the frontend
    @Override
    public List<String> getAllMediaUrls(Media media) {
        List<String> urls = new ArrayList<>();
        for (ObjectId gridFsId : media.getGridFsIds()) {
            String fileUrl = "http://localhost:9004/api/media/download/" + gridFsId.toHexString(); // Assuming /media/download/{fileId} is used to download
            urls.add(fileUrl);
        }


        return urls;
    }

    @Override
    public Resource getMediaFileById(ObjectId gridFsId) throws IOException {
        GridFSFile gridFsFile = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(gridFsId)));
        if (gridFsFile == null) {
            return null;
        }
        return gridFsTemplate.getResource(gridFsFile);
    }






}
