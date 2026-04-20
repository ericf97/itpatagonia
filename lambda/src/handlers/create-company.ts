import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { MongoClient, Db } from 'mongodb';
import { validateCompanyData, CompanyValidationError } from '../utils/validators';
import { generateApplicationId } from '../utils/generators';

interface CreateApplicationRequest {
  name: string;
  type: 'Pyme' | 'Corporativa';
  description?: string;
}

interface ApplicationDocument {
  id: string;
  name: string;
  type: string;
  description?: string;
  status: 'pending';
  createdAt: Date;
}

let mongoClient: MongoClient;
let db: Db;

async function getDatabase(): Promise<Db> {
  if (db) return db;

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();
  db = mongoClient.db('itpatagonia');
  return db;
}

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log('Incoming event:', JSON.stringify(event, null, 2));

  try {
    const body: CreateApplicationRequest = JSON.parse(event.body || '{}');

    const validationResult = validateCompanyData(body);
    if (!validationResult.isValid) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'Datos inválidos',
          errors: validationResult.errors,
        }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    const database = await getDatabase();

    const existingApplication = await database
      .collection<ApplicationDocument>('applications')
      .findOne({ name: body.name, status: 'pending' });

    if (existingApplication) {
      return {
        statusCode: 409,
        body: JSON.stringify({
          success: false,
          message: 'Ya existe una solicitud de adhesión pendiente para esta empresa',
          applicationId: existingApplication.id,
        }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    const applicationId = generateApplicationId();
    const applicationDocument: ApplicationDocument = {
      id: applicationId,
      name: body.name,
      type: body.type,
      description: body.description,
      status: 'pending',
      createdAt: new Date(),
    };

    const result = await database
      .collection<ApplicationDocument>('applications')
      .insertOne(applicationDocument);

    console.log('Application inserted:', result.insertedId);

    return {
      statusCode: 201,
      body: JSON.stringify({
        success: true,
        message: 'Solicitud de adhesión recibida exitosamente',
        data: {
          applicationId: applicationId,
          name: applicationDocument.name,
          type: applicationDocument.type,
          description: applicationDocument.description,
          status: applicationDocument.status,
          createdAt: applicationDocument.createdAt.toISOString(),
        },
      }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    console.error('Error processing application:', error);

    const errorMessage =
      error instanceof CompanyValidationError ? error.message : 'Error interno del servidor';
    const statusCode =
      error instanceof CompanyValidationError ? 400 : 500;

    return {
      statusCode: statusCode,
      body: JSON.stringify({
        success: false,
        message: errorMessage,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};