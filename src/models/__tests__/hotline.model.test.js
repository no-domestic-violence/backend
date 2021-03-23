import Hotline from '../hotline.model';

describe('Hotline schema has all required fields', () => {
  test('should have organisation_name', () => {
    const organisationName = Hotline.schema.obj.organisation_name;
    expect(organisationName).toEqual({
      type: String,
      required: true,
    });
  });

  test('should have description', () => {
    const { description } = Hotline.schema.obj;
    expect(description).toEqual({
      type: String,
      required: true,
    });
  });

  test('should have country', () => {
    const { country } = Hotline.schema.obj;
    expect(country).toEqual({ type: String, required: true });
  });

  test('should have city', () => {
    const { city } = Hotline.schema.obj;
    expect(city).toEqual({ type: String, required: true });
  });
  test('should have website', () => {
    const { website } = Hotline.schema.obj;
    expect(website).toEqual({ type: String, required: true });
  });
  test('should have phone', () => {
    const { phone } = Hotline.schema.obj;
    expect(phone).toEqual({ type: String, required: true });
  });
});
