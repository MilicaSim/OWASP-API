import { Body, Controller, Get, HttpCode, InternalServerErrorException, ParseFilePipe, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Permissions } from 'src/decorators/permissions.decorator';
import { ProductAvailabilityDto } from 'src/dtos/product-availability.dto';
import { ProductResult } from 'src/dtos/product-result.dto';
import { Product } from 'src/entities/product.entity';
import { Permission } from 'src/enums/permission.enum';
import { ProductService } from 'src/services/product.service';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { FileInterceptor } from '@nestjs/platform-express';
const Url = require('url'); 
import { diskStorage } from "multer"
import { Request } from 'src/http/request';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(): Promise<Product[]> {
    return this.productService.getAll();
  }

  @Get('/correct')
  async getAllCorrect(): Promise<ProductResult[]> {
    return this.productService.getAllCorrect();
  }

  @Post('update-availability')
  @HttpCode(204)
  @Permissions(Permission.AdminProduct)
  async updateAvailability(
    @Body() data: ProductAvailabilityDto
  ): Promise<void> {
    return this.productService.updateAvailability(data.id, data.isActive);
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({})
  }))
  async uploadImage(
    @Body() data: any,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true
      })) file: Express.Multer.File,
      @Req() req: Request
  ): Promise<any> {
    try {
      await this.productService.uploadFile(data.id, file, req.user);
    } finally {
      if (file)
        fs.rm(file.path, () => {});
    }
  }

  @Post('upload-image-from-url')
  async uploadImageFromUrl(@Body() { imageUrl }: { imageUrl: string }) {
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

      const extension = path.extname(imageUrl);
      const filename = `image-${Date.now()}${extension}`;
      const filePath = path.join(__dirname, '..', 'uploads', filename);

      fs.writeFileSync(filePath, response.data);

      // Handle the uploaded file as needed, e.g., save the filename to a database.

      return { message: 'Image uploaded successfully', filename };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to upload image. ${error.message}`);
    }
  }

  @Post('upload-image-from-url-bad')
  async getImageFromUrl(@Body() { imageUrl }: { imageUrl: string }) {
    return new Promise((resolve, reject) => {
      const url = new URL(imageUrl);
      const request = https.get(url, (response) => {
        let body = '';
  
        response.on('data', (chunk) => {
          body += chunk;
        });
  
        response.on('end', () => {
          resolve(body);
        });
      });
  
      request.on('error', (error) => {
        reject(error);
      });
  
      request.end();
    });
  }

  @Post('upload-image-from-url-good')
  async getImageFromUrlGood(@Body() { imageUrl }: { imageUrl: string }) {
    if (!this.isValidUrl(imageUrl)) {
      throw new Error('Invalid URL format');
    }

    return new Promise((resolve, reject) => {
      const url = new Url(imageUrl);

      const request = https.get(url, (response) => {
        let body = '';
  
        response.on('data', (chunk) => {
          body += chunk;
        });
  
        response.on('end', () => {
          resolve(body);
        });
      });
  
      request.on('error', (error) => {
        reject(error);
      });
  
      request.end();
    });
  }

  /**
   * Checks if the provided url is valid
   * @param url Url
   * @returns Whether the provided url is valid
   */
  isValidUrl(url: string): boolean {
    try {
      new Url(url);
      const urlInfo = Url.parse(url, true);
      if (urlInfo.host() !== 'example.com' && !['http','https'].includes(urlInfo.protocol()))
        return false;
      return true;
    } catch (error) {
      console.log(`Error in function 'isValidUrl': ${error.message}`)
      return false;
    }
  }
}
