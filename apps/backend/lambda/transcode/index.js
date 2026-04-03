const {
  MediaConvertClient,
  CreateJobCommand,
  DescribeEndpointsCommand,
} = require('@aws-sdk/client-mediaconvert');

const REGION = process.env.APP_AWS_REGION;
const QUEUE_ARN = process.env.AWS_MEDIACONVERT_QUEUE_ARN;
const ROLE_ARN = process.env.AWS_MEDIACONVERT_ROLE_ARN;
const BUCKET = process.env.S3_BUCKET_NAME;

async function getMediaConvertEndpoint() {
  const client = new MediaConvertClient({ region: REGION });
  const { Endpoints } = await client.send(new DescribeEndpointsCommand({}));
  return Endpoints[0].Url;
}

exports.handler = async (event) => {
  const record = event.Records[0];
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

  // Only process files uploaded to the raw/ prefix
  if (!key.startsWith('raw/')) {
    console.log(`Skipping non-raw key: ${key}`);
    return;
  }

  const inputUri = `s3://${BUCKET}/${key}`;

  // Derive output path from filename: raw/12345-film.mp4 → hls/12345-film/
  const filename = key.replace('raw/', '').replace(/\.[^/.]+$/, '');
  const outputUri = `s3://${BUCKET}/hls/${filename}/`;

  const endpoint = await getMediaConvertEndpoint();
  const client = new MediaConvertClient({ region: REGION, endpoint });

  const job = {
    Queue: QUEUE_ARN,
    Role: ROLE_ARN,
    Settings: {
      Inputs: [
        {
          FileInput: inputUri,
          AudioSelectors: { 'Audio Selector 1': { DefaultSelection: 'DEFAULT' } },
        },
      ],
      OutputGroups: [
        {
          Name: 'HLS Group',
          OutputGroupSettings: {
            Type: 'HLS_GROUP_SETTINGS',
            HlsGroupSettings: {
              Destination: outputUri,
              SegmentLength: 6,
              MinSegmentLength: 0,
            },
          },
          Outputs: [
            {
              NameModifier: '_1080p',
              VideoDescription: {
                Width: 1920,
                Height: 1080,
                CodecSettings: {
                  Codec: 'H_264',
                  H264Settings: {
                    Bitrate: 5000000,
                    RateControlMode: 'CBR',
                    CodecProfile: 'HIGH',
                    CodecLevel: 'LEVEL_4_1',
                  },
                },
              },
              AudioDescriptions: [
                {
                  AudioSourceName: 'Audio Selector 1',
                  CodecSettings: {
                    Codec: 'AAC',
                    AacSettings: { Bitrate: 128000, SampleRate: 48000, Channels: 2, CodingMode: 'CODING_MODE_2_0' },
                  },
                },
              ],
              ContainerSettings: { Container: 'M3U8' },
            },
            {
              NameModifier: '_720p',
              VideoDescription: {
                Width: 1280,
                Height: 720,
                CodecSettings: {
                  Codec: 'H_264',
                  H264Settings: {
                    Bitrate: 2500000,
                    RateControlMode: 'CBR',
                    CodecProfile: 'MAIN',
                    CodecLevel: 'LEVEL_3_1',
                  },
                },
              },
              AudioDescriptions: [
                {
                  AudioSourceName: 'Audio Selector 1',
                  CodecSettings: {
                    Codec: 'AAC',
                    AacSettings: { Bitrate: 128000, SampleRate: 48000, Channels: 2, CodingMode: 'CODING_MODE_2_0' },
                  },
                },
              ],
              ContainerSettings: { Container: 'M3U8' },
            },
          ],
        },
      ],
    },
  };

  const { Job } = await client.send(new CreateJobCommand(job));
  console.log(`MediaConvert job created: ${Job.Id} for ${key}`);
};
