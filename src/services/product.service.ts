import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductResult } from 'src/dtos/product-result.dto';
import { Product } from 'src/entities/product.entity';
import { EntityManager } from 'typeorm';
import * as fs from 'fs';
import * as pth from 'path';
import { User } from 'src/entities/user.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ProductService {
  private readonly storagePath = '/var/data/images/products/';
  constructor(
    private entityManager: EntityManager,
    private readonly httpService: HttpService
  ){}

  async getAll(): Promise<Product[]> {
    return this.entityManager.createQueryBuilder(Product, 'p')
      .getMany();
  }

  async getAllCorrect(): Promise<ProductResult[]> {
    const products = await this.entityManager.createQueryBuilder(Product, 'p')
      .getMany();

    let retval: ProductResult[] = [];
    for (const p of products) {
      let product: ProductResult = new ProductResult();
      product.id = p.id;
      product.name = p.name;
      product.description = p.description;
      product.price = p.price;
      product.createdBy = p.created_by_id;
      product.image = p.image;

      retval.push(product);
    }

    return retval;
  }

  /**
   * Update product availability
   * @param id Product id
   * @param isActive Indicates whether the product should be active or not
   */
  async updateAvailability(id: string, isActive: boolean): Promise<void> {
    const product = await Product.findOne({
      where: {
        id: id
      }
    });

    if (!product)
      throw new NotFoundException(`Product with provided id does not exist`);

    product.is_active = isActive;
    await product.save();
  }


  /**
   * Buy product
   * @param productId Product id
   * @param cardId Card id
   */
  async buy(productId: string, cardId: string): Promise<void> {
    const product = await Product.findOne({
      where: {
        id: productId,
        is_active: true
      }
    });

    if (!product)
      throw new NotFoundException(`Product with provided id does not exist`);

    // validate card
    const cardInfo = await this.httpService.get(`http://localhost:3001/card/${cardId}`);
    if (!cardInfo)
      throw new NotFoundException(`Card with provided id does not exist`);

    // buy product
    try {
      const result = await this.httpService.post('http://localhost:3001/card', {
        card_number: cardInfo['cardNumber'],
        amount: product.price
      });
    } catch (error: any) {
      console.log(`Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Upload provided file
   * @param productId
   * @param file 
   * @param user Currently logged in user
   */
  async uploadFile(productId: string, file: Express.Multer.File, user: User) {
    const allowedFileTypes = ['image/jpeg', 'image/png'];

    const product = await Product.findOne({
      where: {
        id: productId
      }
    });

    if (!product)
      throw new NotFoundException('Product with provided id does not exist');

    const fileSize = file.size;
    if (!user.hasEnoughSpace(this.entityManager, fileSize))
      throw new BadRequestException(`User does not have enough storage space for this action`);

    if (!allowedFileTypes.includes(file.mimetype))
      throw new BadRequestException(`allowed file types are: png and jpeg`);

    // Check if the destination folder exists, and create it if not
    const destinationFolder = pth.join(this.storagePath, product.id);
    if (!fs.existsSync(destinationFolder))
      fs.mkdirSync(destinationFolder);

    // Build the full path to save the file
    const filePath = pth.join(destinationFolder, file.originalname);
    fs.copyFileSync(file.path, filePath);

    // update user's used storage space
    user.used_space += fileSize;
    user.save();
  }



  //   /**
  //  * Upload provided file
  //  * @param productId
  //  * @param file 
  //  */
  //   async uploadFile(productId: string, file: Express.Multer.File, user: User) {
  //     const product = await Product.findOne({
  //       where: {
  //         id: productId
  //       }
  //     });
  
  //     if(!product)
  //       throw new NotFoundException();
  
  //     // const fileSize = file.size;
  //     // if (!user.hasEnoughSpace(this.entityManager, fileSize))
  //     //   throw new BadRequestException();
  
  //     // Check if the destination folder exists, and create it if not
  //     const destinationFolder = pth.join(this.storagePath, product.id_number.toString());
  //     if (!fs.existsSync(destinationFolder)) {
  //       fs.mkdirSync(destinationFolder);
  //     }
  
  //     // Generate a unique filename
  //     const uniqueFilename = file.originalname;
  
  //     // Build the full path to save the file
  //     const filePath = pth.join(destinationFolder, uniqueFilename);
  
  //     fs.copyFileSync(file.path, filePath);
  //   }
}
