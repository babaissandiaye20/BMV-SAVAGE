import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseService } from '../validation/exception/response/response.service';
import { FileStorageService, FileUploadResult } from '../upload/interfaces/upload.interface';
import { DocumentType } from '@prisma/client';
import { HttpException } from '@nestjs/common';

describe('DocumentService', () => {
  let service: DocumentService;
  let prismaService: PrismaService;
  let responseService: ResponseService;
  let uploadService: FileStorageService;

  // Create mock implementations
  const mockPrismaService = {
    document: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockResponseService = {
    success: jest.fn(),
    created: jest.fn(),
    badRequest: jest.fn(),
    notFound: jest.fn(),
  };

  const mockUploadService: FileStorageService = {
    uploadSingle: jest.fn().mockResolvedValue({ url: 'https://example.com/file.pdf' } as FileUploadResult),
    uploadMultiple: jest.fn(),
    deleteFile: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ResponseService,
          useValue: mockResponseService,
        },
        {
          provide: 'UploadService',
          useValue: mockUploadService,
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    prismaService = module.get<PrismaService>(PrismaService);
    responseService = module.get<ResponseService>(ResponseService);
    uploadService = module.get<FileStorageService>('UploadService');

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upload', () => {
    const userId = 'user-123';
    const file = {
      originalname: 'test.pdf',
      mimetype: 'application/pdf',
      size: 1024 * 1024, // 1MB
      buffer: Buffer.from('test'),
    } as Express.Multer.File;
    const type = DocumentType.LICENSE;

    it('should upload a document successfully', async () => {
      const createdDoc = { id: 'doc-123', userId, type, fileUrl: 'https://example.com/file.pdf' };
      mockPrismaService.document.create.mockResolvedValue(createdDoc);
      mockResponseService.created.mockReturnValue({ success: true, data: createdDoc });

      const result = await service.upload(userId, file, type);

      expect(mockUploadService.uploadSingle).toHaveBeenCalledWith(file, 'documents');
      expect(mockPrismaService.document.create).toHaveBeenCalledWith({
        data: {
          userId,
          type,
          fileUrl: 'https://example.com/file.pdf',
        },
      });
      expect(mockResponseService.created).toHaveBeenCalledWith(createdDoc, 'Document uploadé');
      expect(result).toEqual({ success: true, data: createdDoc });
    });

    it('should throw an error if no file is provided', async () => {
      mockResponseService.badRequest.mockReturnValue(new HttpException('Aucun fichier fourni', 400));

      await expect(service.upload(userId, null, type)).rejects.toThrow(HttpException);

      expect(mockResponseService.badRequest).toHaveBeenCalledWith(['Aucun fichier fourni']);
      expect(mockUploadService.uploadSingle).not.toHaveBeenCalled();
    });

    it('should throw an error if file is too large', async () => {
      const largeFile = {
        ...file,
        size: 5 * 1024 * 1024, // 5MB (exceeds 4MB limit)
      } as Express.Multer.File;

      mockResponseService.badRequest.mockReturnValue(new HttpException('Fichier trop volumineux', 400));

      await expect(service.upload(userId, largeFile, type)).rejects.toThrow(HttpException);

      expect(mockResponseService.badRequest).toHaveBeenCalledWith(['Fichier trop volumineux (> 4 Mo)']);
      expect(mockUploadService.uploadSingle).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    const userId = 'user-123';
    const docs = [
      { id: 'doc-1', userId, type: DocumentType.LICENSE, fileUrl: 'https://example.com/file1.pdf' },
      { id: 'doc-2', userId, type: DocumentType.TITLE, fileUrl: 'https://example.com/file2.pdf' },
    ];

    it('should return all documents for a user', async () => {
      mockPrismaService.document.findMany.mockResolvedValue(docs);
      mockResponseService.success.mockReturnValue({ success: true, data: docs });

      const result = await service.findAll(userId);

      expect(mockPrismaService.document.findMany).toHaveBeenCalledWith({
        where: { userId, deletedAt: null },
      });
      expect(mockResponseService.success).toHaveBeenCalledWith(docs, 'Documents retrouvés');
      expect(result).toEqual({ success: true, data: docs });
    });
  });

  describe('findOne', () => {
    const docId = 'doc-123';
    const doc = { id: docId, userId: 'user-123', type: DocumentType.LICENSE, fileUrl: 'https://example.com/file.pdf' };

    it('should return a document by id', async () => {
      mockPrismaService.document.findUnique.mockResolvedValue(doc);
      mockResponseService.success.mockReturnValue({ success: true, data: doc });

      const result = await service.findOne(docId);

      expect(mockPrismaService.document.findUnique).toHaveBeenCalledWith({ where: { id: docId } });
      expect(mockResponseService.success).toHaveBeenCalledWith(doc, 'Document trouvé');
      expect(result).toEqual({ success: true, data: doc });
    });
  });

  describe('update', () => {
    const docId = 'doc-123';
    const type = DocumentType.TITLE;
    const updatedDoc = { id: docId, userId: 'user-123', type, fileUrl: 'https://example.com/file.pdf' };

    it('should update a document type', async () => {
      mockPrismaService.document.update.mockResolvedValue(updatedDoc);
      mockResponseService.success.mockReturnValue({ success: true, data: updatedDoc });

      const result = await service.update(docId, type);

      expect(mockPrismaService.document.update).toHaveBeenCalledWith({
        where: { id: docId },
        data: { type },
      });
      expect(mockResponseService.success).toHaveBeenCalledWith(updatedDoc, 'Document mis à jour');
      expect(result).toEqual({ success: true, data: updatedDoc });
    });
  });

  describe('remove', () => {
    const docId = 'doc-123';
    const deletedDoc = { 
      id: docId, 
      userId: 'user-123', 
      type: DocumentType.LICENSE, 
      fileUrl: 'https://example.com/file.pdf',
      deletedAt: new Date()
    };

    it('should soft delete a document', async () => {
      mockPrismaService.document.update.mockResolvedValue(deletedDoc);
      mockResponseService.success.mockReturnValue({ success: true, data: deletedDoc });

      const result = await service.remove(docId);

      expect(mockPrismaService.document.update).toHaveBeenCalledWith({
        where: { id: docId },
        data: { deletedAt: expect.any(Date) },
      });
      expect(mockUploadService.deleteFile).toHaveBeenCalledWith(deletedDoc.fileUrl);
      expect(mockResponseService.success).toHaveBeenCalledWith(deletedDoc, 'Document supprimé');
      expect(result).toEqual({ success: true, data: deletedDoc });
    });
  });
});
