package com.twitter.MediaMS.collection;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collation = "media")
public class Media {

    @Id
    private ObjectId id;  // Media ID (ObjectId in MongoDB)

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
// Constructors, Getters, and Setters


    public Media(List<String> filenames, List<String> contentTypes, List<Long> sizes, List<ObjectId> gridFsIds) {
        this.filenames = filenames;
        this.contentTypes = contentTypes;
        this.sizes = sizes;
        this.gridFsIds = gridFsIds;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
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




}
