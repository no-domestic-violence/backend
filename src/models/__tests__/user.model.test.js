import User from '../user.model';
import { ROLE } from '../../constants';

describe('User schema has all required fields', () => {
    test('should have username', () => {
      const {username} = User.schema.obj;
      expect(username).toEqual({
        type: String,
        required: true,
        trim: true,
        unique: true,
      });
    }); 
  
    test('should have email', () => {
      const { email } = User.schema.obj;
      expect(email).toEqual({
        type: String,
        required: true,
        trim: true,
        unique: true,
      });
    });
  
    test('should have password', () => {
      const { password } = User.schema.obj;
      expect(password).toEqual({ 
        type: String,
        required: true,
      });
    });

    test('should have roles for contacts', () => {
      const { role } = User.schema.obj;
      expect(role).toEqual({ 
        type: String,
        required: true,
        default: ROLE.BASIC,
        enum: [ROLE.BASIC, ROLE.EDITOR, ROLE.ADMIN],
      });
    });
    
    test('should have contacts', () => {
        const { contacts } = User.schema.obj;
        expect(contacts).toBe(Array);
        expect(contacts).toHaveProperty('name');
        expect(contacts).toHaveProperty('phone');
        expect(contacts).toHaveProperty('message');
      });
});

describe('contact schema has all required fields', () => {
    test('should have phone', () => {
        const { phone } = User.schema.obj.contactSchema;
        expect(phone).toEqual({ type: String});
    });

    test('should have message', () => {
    const { message } = User.schema.obj.contactSchema;
    expect(message).toEqual({ type: String});
    });  
});
