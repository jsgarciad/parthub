import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Part } from '../entities/Part';
import { Store } from '../entities/Store';

// Repositories
const partRepository = AppDataSource.getRepository(Part);
const storeRepository = AppDataSource.getRepository(Store);

// Helper function to validate and parse price
const validatePrice = (price: any): number => {
  if (price === undefined || price === null) {
    return 0;
  }
  
  // Convert to number if it's a string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Check if it's a valid number after conversion
  if (isNaN(numPrice)) {
    return 0;
  }
  
  return numPrice;
};

// Create a new part
export const createPart = async (req: Request, res: Response) => {
  try {
    console.log('Create part request received:', req.body);
    const { name, description, price, imageUrl, category, brand, model, year } = req.body;
    const storeId = (req as any).user.storeId;

    // Find store
    const store = await storeRepository.findOne({ where: { id: storeId } });
    if (!store) {
      console.log(`Create part failed: Store ID ${storeId} not found`);
      return res.status(404).json({ message: 'Store not found' });
    }

    // Validate price
    const validatedPrice = validatePrice(price);
    if (validatedPrice === 0 && price !== 0) {
      console.log(`Create part warning: Invalid price format: ${price}, defaulting to 0`);
    }

    // Create new part
    const part = new Part();
    part.name = name || 'Unnamed Part';
    part.description = description || null;
    part.price = validatedPrice;
    part.imageUrl = imageUrl || null;
    part.category = category || null;
    part.brand = brand || null;
    part.model = model || null;
    part.year = year || null;
    part.store = store;

    // Save part
    await partRepository.save(part);
    console.log(`Part ${name} created successfully for store ${store.name}`);

    return res.status(201).json({ 
      message: 'Part created successfully',
      part: {
        id: part.id,
        name: part.name,
        description: part.description,
        price: part.price,
        imageUrl: part.imageUrl,
        category: part.category,
        brand: part.brand,
        model: part.model,
        year: part.year,
        isAvailable: part.isAvailable,
        createdAt: part.createdAt,
        updatedAt: part.updatedAt
      }
    });
  } catch (error) {
    console.error('Create part error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all parts for a store
export const getStoreParts = async (req: Request, res: Response) => {
  try {
    const storeId = (req as any).user.storeId;
    console.log(`Get store parts request received for store ID: ${storeId}`);

    const parts = await partRepository.find({
      where: { store: { id: storeId } },
      order: { createdAt: 'DESC' }
    });

    console.log(`Found ${parts.length} parts for store ID ${storeId}`);
    return res.status(200).json(parts);
  } catch (error) {
    console.error('Get store parts error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a specific part
export const getPart = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const storeId = (req as any).user.storeId;
    console.log(`Get part request received for part ID: ${id}, store ID: ${storeId}`);

    const part = await partRepository.findOne({
      where: { id, store: { id: storeId } }
    });

    if (!part) {
      console.log(`Get part failed: Part ID ${id} not found for store ID ${storeId}`);
      return res.status(404).json({ message: 'Part not found' });
    }

    console.log(`Part ${id} retrieved successfully`);
    return res.status(200).json(part);
  } catch (error) {
    console.error('Get part error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a part
export const updatePart = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const storeId = (req as any).user.storeId;
    const { name, description, price, imageUrl, isAvailable, category, brand, model, year } = req.body;
    console.log(`Update part request received for part ID: ${id}, store ID: ${storeId}`);

    // Find part
    const part = await partRepository.findOne({
      where: { id, store: { id: storeId } }
    });

    if (!part) {
      console.log(`Update part failed: Part ID ${id} not found for store ID ${storeId}`);
      return res.status(404).json({ message: 'Part not found' });
    }

    // Update part
    if (name !== undefined) part.name = name || 'Unnamed Part';
    if (description !== undefined) part.description = description;
    if (price !== undefined) {
      const validatedPrice = validatePrice(price);
      if (validatedPrice === 0 && price !== 0) {
        console.log(`Update part warning: Invalid price format: ${price}, defaulting to 0`);
      }
      part.price = validatedPrice;
    }
    if (imageUrl !== undefined) part.imageUrl = imageUrl;
    if (isAvailable !== undefined) part.isAvailable = isAvailable;
    if (category !== undefined) part.category = category;
    if (brand !== undefined) part.brand = brand;
    if (model !== undefined) part.model = model;
    if (year !== undefined) part.year = year;

    // Save updated part
    await partRepository.save(part);
    console.log(`Part ${id} updated successfully`);

    return res.status(200).json({ 
      message: 'Part updated successfully',
      part
    });
  } catch (error) {
    console.error('Update part error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a part
export const deletePart = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const storeId = (req as any).user.storeId;
    console.log(`Delete part request received for part ID: ${id}, store ID: ${storeId}`);

    // Find part
    const part = await partRepository.findOne({
      where: { id, store: { id: storeId } }
    });

    if (!part) {
      console.log(`Delete part failed: Part ID ${id} not found for store ID ${storeId}`);
      return res.status(404).json({ message: 'Part not found' });
    }

    // Delete part
    await partRepository.remove(part);
    console.log(`Part ${id} deleted successfully`);

    return res.status(200).json({ message: 'Part deleted successfully' });
  } catch (error) {
    console.error('Delete part error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all parts (public endpoint)
export const getAllParts = async (req: Request, res: Response) => {
  try {
    console.log('Get all public parts request received', { query: req.query });
    const { category, brand, model, year, search } = req.query;
    
    // Build query
    let queryBuilder = partRepository.createQueryBuilder('part')
      .leftJoinAndSelect('part.store', 'store')
      .where('part.isAvailable = :isAvailable', { isAvailable: true });
    
    // Apply filters
    if (category) {
      queryBuilder = queryBuilder.andWhere('part.category = :category', { category });
    }
    
    if (brand) {
      queryBuilder = queryBuilder.andWhere('part.brand = :brand', { brand });
    }
    
    if (model) {
      queryBuilder = queryBuilder.andWhere('part.model = :model', { model });
    }
    
    if (year) {
      queryBuilder = queryBuilder.andWhere('part.year = :year', { year });
    }
    
    if (search) {
      queryBuilder = queryBuilder.andWhere(
        '(part.name ILIKE :search OR part.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }
    
    // Execute query
    const parts = await queryBuilder
      .orderBy('part.createdAt', 'DESC')
      .getMany();
    
    console.log(`Found ${parts.length} public parts`);
    
    // If no parts found, return empty array instead of error
    if (parts.length === 0) {
      console.log('No parts found, returning empty array');
      return res.status(200).json([]);
    }
    
    return res.status(200).json(parts);
  } catch (error) {
    console.error('Get all parts error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 