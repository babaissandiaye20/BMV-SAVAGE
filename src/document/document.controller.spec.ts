import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { DocumentType } from '@prisma/client';
import { HttpException } from '@nestjs/common';

describe('DocumentController', () => {
  let controller: DocumentController;
  let documentService: DocumentService;

  // Create mock implementation of DocumentService
  const mockDocumentService = {
    upload: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: DocumentService,
          useValue: mockDocumentService,
        },
      ],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
    documentService = module.get<DocumentService>(DocumentService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('upload', () => {
    const userId = 'user-123';
    const file = {
      originalname: 'test.pdf',
      mimetype: 'application/pdf',
      size: 1024 * 1024,
      buffer: Buffer.from('test'),
    } as Express.Multer.File;
    const body = { type: DocumentType.LICENSE };
    const req = { user: { id: userId } };

    it('should call documentService.upload with correct parameters', async () => {
      mockDocumentService.upload.mockResolvedValue({ success: true });

      const result = await controller.upload(file, body, req as any);

      expect(documentService.upload).toHaveBeenCalledWith(userId, file, body.type);
      expect(result).toEqual({ success: true });
    });

    it('should handle error when upload fails', async () => {
      mockDocumentService.upload.mockRejectedValue(new HttpException('Upload failed', 400));

      await expect(controller.upload(file, body, req as any)).rejects.toThrow(HttpException);

      expect(documentService.upload).toHaveBeenCalledWith(userId, file, body.type);
    });
  });

  describe('findAll', () => {
    const userId = 'user-123';
    const req = { user: { id: userId } };
    const docs = [
      { id: 'doc-1', type: DocumentType.LICENSE },
      { id: 'doc-2', type: DocumentType.TITLE },
    ];

    it('should call documentService.findAll with correct user id', async () => {
      mockDocumentService.findAll.mockResolvedValue({ success: true, data: docs });

      const result = await controller.findAll(req as any);

      expect(documentService.findAll).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ success: true, data: docs });
    });
  });

  describe('findOne', () => {
    const docId = 'doc-123';
    const params = { id: docId };
    const doc = { id: docId, type: DocumentType.LICENSE };

    it('should call documentService.findOne with correct id', async () => {
      mockDocumentService.findOne.mockResolvedValue({ success: true, data: doc });

      const result = await controller.findOne(params);

      expect(documentService.findOne).toHaveBeenCalledWith(docId);
      expect(result).toEqual({ success: true, data: doc });
    });

    it('should handle error when document is not found', async () => {
      mockDocumentService.findOne.mockRejectedValue(new HttpException('Document not found', 404));

      await expect(controller.findOne(params)).rejects.toThrow(HttpException);

      expect(documentService.findOne).toHaveBeenCalledWith(docId);
    });
  });

  describe('update', () => {
    const docId = 'doc-123';
    const params = { id: docId };
    const body = { type: DocumentType.TITLE };
    const updatedDoc = { id: docId, type: body.type };

    it('should call documentService.update with correct parameters', async () => {
      mockDocumentService.update.mockResolvedValue({ success: true, data: updatedDoc });

      const result = await controller.update(params, body);

      expect(documentService.update).toHaveBeenCalledWith(docId, body.type);
      expect(result).toEqual({ success: true, data: updatedDoc });
    });

    it('should handle error when update fails', async () => {
      mockDocumentService.update.mockRejectedValue(new HttpException('Update failed', 400));

      await expect(controller.update(params, body)).rejects.toThrow(HttpException);

      expect(documentService.update).toHaveBeenCalledWith(docId, body.type);
    });
  });

  describe('remove', () => {
    const docId = 'doc-123';
    const params = { id: docId };
    const deletedDoc = { id: docId, deletedAt: new Date() };

    it('should call documentService.remove with correct id', async () => {
      mockDocumentService.remove.mockResolvedValue({ success: true, data: deletedDoc });

      const result = await controller.remove(params);

      expect(documentService.remove).toHaveBeenCalledWith(docId);
      expect(result).toEqual({ success: true, data: deletedDoc });
    });

    it('should handle error when removal fails', async () => {
      mockDocumentService.remove.mockRejectedValue(new HttpException('Removal failed', 400));

      await expect(controller.remove(params)).rejects.toThrow(HttpException);

      expect(documentService.remove).toHaveBeenCalledWith(docId);
    });
  });
});
