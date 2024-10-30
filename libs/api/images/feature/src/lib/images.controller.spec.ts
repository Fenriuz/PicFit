import { Test } from '@nestjs/testing';
import { ImagesController } from './images.controller';

describe('ImagesController', () => {
  let controller: ImagesController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [ImagesController],
    }).compile();

    controller = module.get(ImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
