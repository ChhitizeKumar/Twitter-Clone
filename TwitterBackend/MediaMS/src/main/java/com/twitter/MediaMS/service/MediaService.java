package com.twitter.MediaMS.service;

import com.twitter.MediaMS.collection.Media;
import com.twitter.MediaMS.dto.MediaDTO;
import com.twitter.MediaMS.exception.MediaException;
import org.bson.types.ObjectId;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface MediaService {
    public Media storeMultipleMedia(List<MultipartFile> files) throws IOException, MediaException;
    public MediaDTO getMediaById(ObjectId id) throws MediaException;
    public void deleteMedia(ObjectId  id) throws MediaException;

    public List<Resource> getAllMediaFilesById(ObjectId mediaId) throws IOException;

    public Media findMediaById(ObjectId id);

    public List<String> getAllMediaUrls(Media media);

    public Resource getMediaFileById(ObjectId gridFsId) throws IOException;
}
