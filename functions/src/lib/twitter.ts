import * as functions from "firebase-functions";
import TwitterApi from "twitter-api-v2";
import { makeShortTitle, convertTwitterAccount } from "../util";

const twitterClient = new TwitterApi({
  appKey: functions.config().twitter.design_app_key,
  appSecret: functions.config().twitter.design_app_secret,
  accessToken: functions.config().twitter.design_access_token,
  accessSecret: functions.config().twitter.design_access_secret,
});

const _formatToTweet = (data: FormattedItem) => {
  const title = makeShortTitle(data.title, 100);
  const twitter = convertTwitterAccount(data.sourceFrom);
  const link = data.shortLink ? data.shortLink : data.link;

  return `${title}\n${twitter}\n${link}`;
};

const _tweetRSSData = async (data: string): Promise<void> => {
  await twitterClient.v1.tweet(data);
};

export const tweetRSS = async (
  data: FirebaseFirestore.QuerySnapshot
): Promise<void> => {
  console.log("data: " + JSON.stringify(data));
  data.docs.map(async (doc) => {
    console.log("doc: " + doc.data());
    const content = _formatToTweet(doc.data() as FormattedItem);
    await _tweetRSSData(content);
  });
  return;
};
