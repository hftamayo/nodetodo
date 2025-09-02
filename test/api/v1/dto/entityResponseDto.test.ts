import { UsersResponseDTO } from '../../../../src/api/v1/dto/users/usersResponse.dto';
import { RolesResponseDTO } from '../../../../src/api/v1/dto/roles/rolesResponse.dto';
import { TodosResponseDTO } from '../../../../src/api/v1/dto/todos/todosResponse.dto';
import mongoose from 'mongoose';

describe('Entity Response DTOs', () => {
  describe('UsersResponseDTO', () => {
    describe('constructor', () => {
      it('should create a UsersResponseDTO with _id field', () => {
        // Arrange
        const user = {
          _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
          name: 'John Doe',
          email: 'john@example.com',
          role: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
          status: true
        };

        // Act
        const response = new UsersResponseDTO(user);

        // Assert
        expect(response.id).toBe('507f1f77bcf86cd799439011');
        expect(response.name).toBe('John Doe');
        expect(response.email).toBe('john@example.com');
        expect(response.status).toBe(true);
      });

      it('should create a UsersResponseDTO with id field', () => {
        // Arrange
        const user = {
          _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
          name: 'Jane Doe',
          email: 'jane@example.com',
          role: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
          status: true
        };

        // Act
        const response = new UsersResponseDTO(user);

        // Assert
        expect(response.id).toBe('507f1f77bcf86cd799439011');
        expect(response.name).toBe('Jane Doe');
        expect(response.email).toBe('jane@example.com');
        expect(response.status).toBe(true);
      });

      it('should handle user with minimal fields', () => {
        // Arrange
        const user = {
          _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
          name: 'Test User',
          email: 'test@example.com',
          role: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
          status: true
        };

        // Act
        const response = new UsersResponseDTO(user);

        // Assert
        expect(response.id).toBe('507f1f77bcf86cd799439011');
        expect(response.name).toBe('Test User');
        expect(response.email).toBe('test@example.com');
      });

      it('should handle user with additional fields', () => {
        // Arrange
        const user = {
          _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
          name: 'John Doe',
          email: 'john@example.com',
          role: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
          status: true
        };

        // Act
        const response = new UsersResponseDTO(user);

        // Assert
        expect(response.id).toBe('507f1f77bcf86cd799439011');
        expect(response.name).toBe('John Doe');
        expect(response.email).toBe('john@example.com');
        expect(response.status).toBe(true);
      });
    });

    describe('serialization', () => {
      it('should serialize to JSON correctly', () => {
        // Arrange
        const user = {
          _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
          name: 'John Doe',
          email: 'john@example.com',
          role: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
          status: true
        };

        // Act
        const response = new UsersResponseDTO(user);
        const json = JSON.stringify(response);

        // Assert
        const expectedJson = JSON.stringify({
          id: '507f1f77bcf86cd799439011',
          name: 'John Doe',
          email: 'john@example.com',
          role: '507f1f77bcf86cd799439012',
          status: true
        });
        expect(json).toBe(expectedJson);
      });
    });
  });

  describe('RolesResponseDTO', () => {
    describe('constructor', () => {
      it('should create a RolesResponseDTO with _id field', () => {
        // Arrange
        const role = {
          _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
          name: 'admin',
          description: 'Administrator role',
          status: true,
          permissions: {
            users: 15,
            roles: 15
          }
        };

        // Act
        const response = new RolesResponseDTO(role);

        // Assert
        expect(response.id).toBe('507f1f77bcf86cd799439012');
        expect(response.name).toBe('admin');
        expect(response.description).toBe('Administrator role');
        expect(response.status).toBe(true);
        expect(response.permissions).toEqual({ users: 15, roles: 15 });
      });

      it('should create a RolesResponseDTO with id field', () => {
        // Arrange
        const role = {
          _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
          name: 'user',
          description: 'Regular user role',
          status: true,
          permissions: {
            users: 1,
            todos: 7
          }
        };

        // Act
        const response = new RolesResponseDTO(role);

        // Assert
        expect(response.id).toBe('507f1f77bcf86cd799439012');
        expect(response.name).toBe('user');
        expect(response.description).toBe('Regular user role');
        expect(response.status).toBe(true);
        expect(response.permissions).toEqual({ users: 1, todos: 7 });
      });

      it('should handle role with minimal fields', () => {
        // Arrange
        const role = {
          _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
          name: 'guest',
          description: 'Guest role',
          status: true,
          permissions: {}
        };

        // Act
        const response = new RolesResponseDTO(role);

        // Assert
        expect(response.id).toBe('507f1f77bcf86cd799439012');
        expect(response.name).toBe('guest');
        expect(response.description).toBe('Guest role');
      });

      it('should handle role with additional fields', () => {
        // Arrange
        const role = {
          _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
          name: 'supervisor',
          description: 'Supervisor role',
          status: true,
          permissions: {
            users: 3,
            todos: 15
          }
        };

        // Act
        const response = new RolesResponseDTO(role);

        // Assert
        expect(response.id).toBe('507f1f77bcf86cd799439012');
        expect(response.name).toBe('supervisor');
        expect(response.description).toBe('Supervisor role');
        expect(response.status).toBe(true);
      });
    });

    describe('serialization', () => {
      it('should serialize to JSON correctly', () => {
        // Arrange
        const role = {
          _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
          name: 'admin',
          description: 'Administrator role',
          status: true,
          permissions: {
            users: 15,
            roles: 15
          }
        };

        // Act
        const response = new RolesResponseDTO(role);
        const json = JSON.stringify(response);

        // Assert
        const expectedJson = JSON.stringify({
          id: '507f1f77bcf86cd799439012',
          name: 'admin',
          description: 'Administrator role',
          status: true,
          permissions: { users: 15, roles: 15 }
        });
        expect(json).toBe(expectedJson);
      });
    });
  });

  describe('TodosResponseDTO', () => {
    describe('constructor', () => {
      it('should create a TodosResponseDTO with _id field', () => {
        // Arrange
        const todo = {
          _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'),
          title: 'Complete project',
          description: 'Finish the Node.js todo application',
          completed: false,
          owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011')
        };

        // Act
        const response = new TodosResponseDTO(todo);

        // Assert
        expect(response.id).toBe('507f1f77bcf86cd799439013');
        expect(response.title).toBe('Complete project');
        expect(response.description).toBe('Finish the Node.js todo application');
        expect(response.completed).toBe(false);
      });

      it('should create a TodosResponseDTO with id field', () => {
        // Arrange
        const todo = {
          _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'),
          title: 'Review code',
          description: 'Review the latest changes',
          completed: true,
          owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011')
        };

        // Act
        const response = new TodosResponseDTO(todo);

        // Assert
        expect(response.id).toBe('507f1f77bcf86cd799439013');
        expect(response.title).toBe('Review code');
        expect(response.description).toBe('Review the latest changes');
        expect(response.completed).toBe(true);
      });

      it('should handle todo with minimal fields', () => {
        // Arrange
        const todo = {
          _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'),
          title: 'Simple task',
          description: 'A simple todo item',
          completed: false,
          owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011')
        };

        // Act
        const response = new TodosResponseDTO(todo);

        // Assert
        expect(response.id).toBe('507f1f77bcf86cd799439013');
        expect(response.title).toBe('Simple task');
        expect(response.description).toBe('A simple todo item');
      });

      it('should handle todo with additional fields', () => {
        // Arrange
        const todo = {
          _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'),
          title: 'Complex task',
          description: 'A complex todo item',
          completed: false,
          owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011')
        };

        // Act
        const response = new TodosResponseDTO(todo);

        // Assert
        expect(response.id).toBe('507f1f77bcf86cd799439013');
        expect(response.title).toBe('Complex task');
        expect(response.description).toBe('A complex todo item');
        expect(response.completed).toBe(false);
      });
    });

    describe('serialization', () => {
      it('should serialize to JSON correctly', () => {
        // Arrange
        const todo = {
          _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'),
          title: 'Complete project',
          description: 'Finish the Node.js todo application',
          completed: false,
          owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011')
        };

        // Act
        const response = new TodosResponseDTO(todo);
        const json = JSON.stringify(response);

        // Assert
        const expectedJson = JSON.stringify({
          id: '507f1f77bcf86cd799439013',
          title: 'Complete project',
          description: 'Finish the Node.js todo application',
          completed: false,
          owner: '507f1f77bcf86cd799439011'
        });
        expect(json).toBe(expectedJson);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle null _id', () => {
      // Arrange
      const user = {
        _id: null as any,
        name: 'Test User',
        email: 'test@example.com',
        role: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
        status: true
      };

      // Act
      const response = new UsersResponseDTO(user);

      // Assert
      expect(response.id).toBeUndefined();
      expect(response.name).toBe('Test User');
      expect(response.email).toBe('test@example.com');
    });

    it('should handle undefined _id', () => {
      // Arrange
      const user = {
        _id: undefined as any,
        name: 'Test User',
        email: 'test@example.com',
        role: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
        status: true
      };

      // Act
      const response = new UsersResponseDTO(user);

      // Assert
      expect(response.id).toBeUndefined();
      expect(response.name).toBe('Test User');
      expect(response.email).toBe('test@example.com');
    });

    it('should handle empty string _id', () => {
      // Arrange
      const user = {
        _id: '' as any,
        name: 'Test User',
        email: 'test@example.com',
        role: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
        status: true
      };

      // Act
      const response = new UsersResponseDTO(user);

      // Assert
      expect(response.id).toBe('');
      expect(response.name).toBe('Test User');
      expect(response.email).toBe('test@example.com');
    });

    it('should handle ObjectId-like _id', () => {
      // Arrange
      const user = {
        _id: { toString: () => '507f1f77bcf86cd799439011' } as any,
        name: 'Test User',
        email: 'test@example.com',
        role: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
        status: true
      };

      // Act
      const response = new UsersResponseDTO(user);

      // Assert
      expect(response.id).toBe('507f1f77bcf86cd799439011');
      expect(response.name).toBe('Test User');
      expect(response.email).toBe('test@example.com');
    });

    it('should handle special characters in fields', () => {
      // Arrange
      const user = {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        name: 'José María',
        email: 'josé@example.com',
        role: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
        status: true
      };

      // Act
      const response = new UsersResponseDTO(user);

      // Assert
      expect(response.name).toBe('José María');
      expect(response.email).toBe('josé@example.com');
    });

    it('should handle nested objects', () => {
      // Arrange
      const user = {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        name: 'Test User',
        email: 'test@example.com',
        role: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
        status: true
      };

      // Act
      const response = new UsersResponseDTO(user);

      // Assert
      expect(response.name).toBe('Test User');
      expect(response.email).toBe('test@example.com');
      expect(response.status).toBe(true);
    });

    it('should handle arrays', () => {
      // Arrange
      const role = {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
        name: 'admin',
        description: 'Administrator role',
        status: true,
        permissions: {
          users: 15,
          roles: 15
        }
      };

      // Act
      const response = new RolesResponseDTO(role);

      // Assert
      expect(response.name).toBe('admin');
      expect(response.description).toBe('Administrator role');
      expect(response.status).toBe(true);
    });
  });

  describe('integration scenarios', () => {
    it('should work with user creation response', () => {
      // Arrange
      const user = {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        name: 'John Doe',
        email: 'john@example.com',
        role: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
        status: true
      };

      // Act
      const response = new UsersResponseDTO(user);

      // Assert
      expect(response.id).toBe('507f1f77bcf86cd799439011');
      expect(response.name).toBe('John Doe');
      expect(response.email).toBe('john@example.com');
      expect(response.status).toBe(true);
    });

    it('should work with role assignment response', () => {
      // Arrange
      const role = {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
        name: 'supervisor',
        description: 'Supervisor role with elevated permissions',
        status: true,
        permissions: {
          users: 7, // READ + WRITE + UPDATE
          todos: 15, // ALL permissions
          roles: 1 // READ only
        }
      };

      // Act
      const response = new RolesResponseDTO(role);

      // Assert
      expect(response.id).toBe('507f1f77bcf86cd799439012');
      expect(response.name).toBe('supervisor');
      expect(response.description).toBe('Supervisor role with elevated permissions');
      expect(response.status).toBe(true);
      expect((response.permissions as any).users).toBe(7);
      expect((response.permissions as any).todos).toBe(15);
      expect((response.permissions as any).roles).toBe(1);
    });

    it('should work with todo completion response', () => {
      // Arrange
      const todo = {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'),
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the Node.js todo application',
        completed: true,
        owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011')
      };

      // Act
      const response = new TodosResponseDTO(todo);

      // Assert
      expect(response.id).toBe('507f1f77bcf86cd799439013');
      expect(response.title).toBe('Complete project documentation');
      expect(response.description).toBe('Write comprehensive documentation for the Node.js todo application');
      expect(response.completed).toBe(true);
    });
  });
});
