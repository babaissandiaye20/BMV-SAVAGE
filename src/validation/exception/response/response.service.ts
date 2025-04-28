import { Injectable } from '@nestjs/common';
import { Response } from './response.interface';

@Injectable()
export class ResponseService {
  success<T>(data: T, message = 'Opération réussie'): Response<T> {
    return {
      statusCode: 200,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  created<T>(data: T, message = 'Ressource créée avec succès'): Response<T> {
    return {
      statusCode: 201,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  badRequest(errors: string[], message = 'Requête invalide'): Response<void> {
    return {
      statusCode: 400,
      message,
      errors,
      timestamp: new Date().toISOString(),
    };
  }

  forbidden(message = 'Accès interdit'): Response<void> {
    return {
      statusCode: 403,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  notFound(message = 'Ressource non trouvée'): Response<void> {
    return {
      statusCode: 404,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  internalError(message = 'Erreur interne du serveur'): Response<void> {
    return {
      statusCode: 500,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  conflict(message = 'Conflit détecté'): Response<void> {
    return {
      statusCode: 409,
      message,
      timestamp: new Date().toISOString(),
    };
  }



  error(message = 'Erreur interne du serveur'): Response<void> {
    return {
      statusCode: 500,
      message,
      timestamp: new Date().toISOString(),
    };
  }
  unauthorized(message = 'Non autorisé'): Response<void> {
    return {
      statusCode: 401,
      message,
      timestamp: new Date().toISOString(),
    };
  }
}
