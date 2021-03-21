import Shelter from '../shelter.model';

describe('Shelter schema has all required fields', () => {
  test('should have place name', () => {
    const placeName = Shelter.schema.obj.place_name;
    expect(placeName).toEqual({
      type: String,
      required: true,
    });
  });

  test('should have description', () => {
    const description = Shelter.schema.obj.description;
    expect(description).toEqual({
      type: String,
      required: true,
    });
  });

  test('should have latitude', () => {
    const latitude = Shelter.schema.obj.latitude;
    expect(latitude).toEqual({ type: Number, required: true });
  });

  test('should have longitude', () => {
    const longitude = Shelter.schema.obj.longitude;
    expect(longitude).toEqual({ type: Number, required: true });
  });
});
