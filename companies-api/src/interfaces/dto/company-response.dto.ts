import { ApiProperty } from '@nestjs/swagger';
import { CompanyType } from '../../domain/enums/company-type.enum';

export class CompanyResponseDto {
  @ApiProperty({ description: 'The unique identifier of the company' })
  id: string;

  @ApiProperty({ description: 'The name of the company' })
  name: string;

  @ApiProperty({ description: 'The type of the company', enum: CompanyType })
  type: CompanyType;

  @ApiProperty({ description: 'The description of the company', required: false })
  description?: string;

  @ApiProperty({ description: 'The creation date of the company' })
  createdAt: Date;
}
