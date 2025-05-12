import { ResponseService } from '../../validation/exception/response/response.service';

// Create a mock ResponseService that can be used in tests
export const createMockResponseService = () => {
  return {
    success: jest.fn().mockImplementation((data, message = 'Opération réussie') => ({
      statusCode: 200,
      message,
      data,
      timestamp: expect.any(String),
    })),
    
    created: jest.fn().mockImplementation((data, message = 'Ressource créée avec succès') => ({
      statusCode: 201,
      message,
      data,
      timestamp: expect.any(String),
    })),
    
    badRequest: jest.fn().mockImplementation((errors, message = 'Requête invalide') => ({
      statusCode: 400,
      message,
      errors,
      timestamp: expect.any(String),
    })),
    
    forbidden: jest.fn().mockImplementation((message = 'Accès interdit') => ({
      statusCode: 403,
      message,
      timestamp: expect.any(String),
    })),
    
    notFound: jest.fn().mockImplementation((message = 'Ressource non trouvée') => ({
      statusCode: 404,
      message,
      timestamp: expect.any(String),
    })),
    
    internalError: jest.fn().mockImplementation((message = 'Erreur interne du serveur') => ({
      statusCode: 500,
      message,
      timestamp: expect.any(String),
    })),
    
    conflict: jest.fn().mockImplementation((message = 'Conflit détecté') => ({
      statusCode: 409,
      message,
      timestamp: expect.any(String),
    })),
    
    error: jest.fn().mockImplementation((message = 'Erreur interne du serveur') => ({
      statusCode: 500,
      message,
      timestamp: expect.any(String),
    })),
    
    unauthorized: jest.fn().mockImplementation((message = 'Non autorisé') => ({
      statusCode: 401,
      message,
      timestamp: expect.any(String),
    })),
    
    inactiveAccount: jest.fn().mockImplementation((userId) => ({
      statusCode: 400,
      message: 'Compte inactif',
      errors: [
        "Votre compte n'est pas encore activé. Veuillez vérifier votre numéro de téléphone.",
      ],
      data: {
        user: {
          id: userId,
        },
      },
      timestamp: expect.any(String),
    })),
  } as unknown as ResponseService;
};