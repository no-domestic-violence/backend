import Video from '../video.model';

describe('Video schema has all required fields', () => {
  test('should have title', () => {
    const { title } = Video.schema.obj;
    expect(title).toEqual({
      type: String,
      required: true,
    });
  });

  test('should have url_to_video', () => {
    const urlVideo = Video.schema.obj.url_to_video;
    expect(urlVideo).toEqual({
      type: String,
      required: true,
    });
  });

  test('should have imageData', () => {
    const { imageData } = Video.schema.obj;
    expect(imageData).toEqual({ type: String, required: true });
  });
});
