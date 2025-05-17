
import { Prisma, PrismaClient } from "@prisma/client";


interface CartItemWithProduct {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: Prisma.Decimal;
    [key: string]: any;
  };
}

const prisma = new PrismaClient()

export class CartService {
  async create(userId: string) {
    return prisma.cart.create({
      data: {
        userId
      }
    })
  }

  async findByUserId(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const cart = await this.findByUserId(userId)
    if (!cart) throw new Error('Cart not found')

    const existingItem = cart.items.find((item: CartItemWithProduct) => item.productId === productId)
    
    if (existingItem) {
      return prisma.cartItem.update({
        where: {
          id: existingItem.id
        },
        data: {
          quantity: existingItem.quantity + quantity
        },
        include: {
          product: true
        }
      })
    }

    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity
      },
      include: {
        product: true
      }
    })
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.findByUserId(userId)
    if (!cart) throw new Error('Cart not found')

    const item = cart.items.find((item: CartItemWithProduct) => item.productId === productId)
    if (!item) throw new Error('Item not found in cart')

    return prisma.cartItem.delete({
      where: {
        id: item.id
      }
    })
  }

  async clear(userId: string) {
    const cart = await this.findByUserId(userId)
    if (!cart) throw new Error('Cart not found')

    return prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id
      }
    })
  }
}