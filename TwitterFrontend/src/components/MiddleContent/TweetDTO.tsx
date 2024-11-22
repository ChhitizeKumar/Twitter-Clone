export interface TweetDTO {
    content: string;
    likes?: number;
    mediaIds: number[]; // Use the mediaIds if needed, otherwise leave this out
    tweetId?: number;
    userId?: number;
}
