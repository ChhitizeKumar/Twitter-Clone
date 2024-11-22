package com.twitter.MediaMS.dto;

import org.bson.types.ObjectId;

import java.time.LocalDateTime;
import java.util.List;

public class MediaDTO {
    ObjectId mediaId;

    private List<String> filenames;  // List of filenames for multiple media files
    private List<String> contentTypes;  // List of MIME types for each file

    private List<Long> sizes;  // List of file sizes (in bytes) for each file

    private List<ObjectId> gridFsIds;

    public List<ObjectId> getGridFsIds() {
        return gridFsIds;
    }

    public void setGridFsIds(List<ObjectId> gridFsIds) {
        this.gridFsIds = gridFsIds;
    }


    public MediaDTO() {}

    public MediaDTO(List<String> filenames, List<String> contentTypes, List<Long> sizes, String uploadedBy, LocalDateTime uploadedAt) {
        this.filenames = filenames;
        this.contentTypes = contentTypes;
        this.sizes = sizes;
    }
    public ObjectId getMediaId() {
        return mediaId;
    }

    public void setMediaId(ObjectId mediaId) {
        this.mediaId = mediaId;
    }




    public List<String> getFilenames() {
        return filenames;
    }

    public void setFilenames(List<String> filenames) {
        this.filenames = filenames;
    }

    public List<String> getContentTypes() {
        return contentTypes;
    }

    public void setContentTypes(List<String> contentTypes) {
        this.contentTypes = contentTypes;
    }

    public List<Long> getSizes() {
        return sizes;
    }

    public void setSizes(List<Long> sizes) {
        this.sizes = sizes;
    }

    @Override
    public String toString() {
        return "Media{" +
                "mediaId=" + mediaId +
                ", filenames=" + filenames +
                ", contentTypes=" + contentTypes +
                ", sizes=" + sizes +
                '}';
    }
}
