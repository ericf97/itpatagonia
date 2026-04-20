export class CompanyValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CompanyValidationError';
  }
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

export function validateCompanyData(data: any): ValidationResult {
  const errors: string[] = [];

  // Validar nombre
  if (!data.name) {
    errors.push('El nombre de la empresa es requerido');
  } else if (typeof data.name !== 'string') {
    errors.push('El nombre debe ser una cadena de texto');
  } else if (data.name.trim().length < 3) {
    errors.push('El nombre debe tener al menos 3 caracteres');
  } else if (data.name.trim().length > 255) {
    errors.push('El nombre no puede exceder 255 caracteres');
  }

  // Validar tipo
  if (!data.type) {
    errors.push('El tipo de empresa es requerido');
  } else if (!['Pyme', 'Corporativa'].includes(data.type)) {
    errors.push(
      'El tipo de empresa debe ser: Pyme o Corporativa'
    );
  }

  // Validar descripción (opcional)
  if (data.description !== undefined) {
    if (typeof data.description !== 'string') {
      errors.push('La descripción debe ser una cadena de texto');
    } else if (data.description.length > 1000) {
      errors.push('La descripción no puede exceder 1000 caracteres');
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}
