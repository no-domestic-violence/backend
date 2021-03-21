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
    const { description } = Shelter.schema.obj;
    expect(description).toEqual({
      type: String,
      required: true,
    });
  });

  test('should have latitude', () => {
    const { latitude } = Shelter.schema.obj;
    expect(latitude).toEqual({ type: Number, required: true });
  });

  test('should have longitude', () => {
    const { longitude } = Shelter.schema.obj;
    expect(longitude).toEqual({ type: Number, required: true });
  });
});
