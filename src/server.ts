import 'dotenv/config';
import fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from './env';
import { prisma } from './lib/prisma';
import { startOfDay, addDays, startOfMonth, endOfMonth } from 'date-fns';
import z from 'zod';

export const app = fastify();

app.register(cors, {
  origin: [
    'https://bellapizza-client.vercel.app',
    'http://localhost:5173'
  ]
})

app.get('/orders', async (req, reply) => {
  const GetQuerySchema = z.object({
    status: z.enum(['preparing', 'ready']).optional(),
    clientName: z.string().optional(),
  });

  const { status, clientName } = GetQuerySchema.parse(req.query);

  const orders = await prisma.order.findMany({
    where: {
      ...(status && {
        status,
      }),

      ...(clientName && {
        client: {
          name: {
            contains: clientName,
            mode: 'insensitive',
          },
        },
      }),
    },

    orderBy: {
      created_at: 'desc',
    },

    select: {
      id: true,
      status: true,
      created_at: true,

      client: {
        select: {
          name: true,
          addresses: {
            select: {
              street: true,
              number: true,
            },
          },
        },
      },

      orderItems: {
        select: {
          quantity: true,
          product_id: true,
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })

  const formattedOrders = orders.map((order) => ({
    id: order.id,
    status: order.status,
    created_at: order.created_at,
    clientName: order.client.name,
    address: order.client.addresses[0] ?? null,
    items: order.orderItems.map((item) => ({
      quantity: item.quantity,
      productId: item.product_id,
      productName: item.product.name,
    })),
  }))

  return { formattedOrders };
});

app.get('/orders/today', async (req, reply) => {
  const today = new Date()

  const ordersToday = await prisma.order.count({
    where: {
      created_at: {
        gte: startOfDay(today),
        lte: startOfDay(addDays(today, 1)),
      },
    },
  })

  return { ordersToday };
})

app.get('/orders/revenue', async (req, reply) => {
  const date = new Date()

  const startOfMonthDate = startOfMonth(date)
  const endOfMonthDate = endOfMonth(date)

  const result = await prisma.order.aggregate({
    _sum: {
      total_price: true,
    },
    where: {
      created_at: {
        gte: startOfMonthDate,
        lt: endOfMonthDate,
      },
    },
  })

  return { total: Number(result._sum.total_price?.toFixed(2)) ?? 0 }
})

app.post('/orders', async (request, reply) => {
  const deliveryAddressSchema = z.object({
    zipCode: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
  }).optional();

  const cartItemSchema = z.object({
    productId: z.uuid(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
  });
  
  const cartSchema = z.object({
    items: z.array(cartItemSchema).min(1),
    totalPrice: z.number().positive(),
  });
  
  const registerBodySchema = z.object({
    clientName: z.string(),
    telephone: z.string().optional(),
    orderType: z.enum(['delivery', 'pickup']),
    deliveryAddress: deliveryAddressSchema,
    paymentMethod: z.enum(['credit_card', 'pix', 'cash']),
    cart: cartSchema,
  });

  const { 
    clientName, 
    telephone, 
    orderType, 
    deliveryAddress, 
    paymentMethod, 
    cart 
  } = registerBodySchema.parse(request.body);

  const client = await prisma.client.create({
    data: { name: clientName, telephone },
  });

  if (deliveryAddress) {
    await prisma.address.create({
      data: {
        zipCode: deliveryAddress.zipCode,
        street: deliveryAddress.street,
        number: deliveryAddress.number,
        complement: deliveryAddress.complement,
        client_id: client.id,
      },
    });
  }

  const order = await prisma.order.create({
    data: {
      type: orderType,
      payment_method: paymentMethod,
      total_price: cart.totalPrice,
      client_id: client.id,
    },
  });

  const orderItemsData = cart.items.map((item) => ({
    product_id: item.productId,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    order_id: order.id,
  }));

  await prisma.orderItem.createMany({
    data: orderItemsData,
  });

  return reply.status(201).send();
});

app.patch('/orders/:id/status', async (req, reply) => {
  const updateStatusParamsSchema = z.object({
    id: z.uuid(),
  });

  const { id } = updateStatusParamsSchema.parse(req.params);

  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    return reply.status(404).send({ message: 'Order not found' });
  }

  await prisma.order.update({
    where: {
      id,
    },
    data: {
      status: 'ready',
    },
  })

  return reply.status(204).send();
});

app.get('/products', async () => {
  const products = await prisma.product.findMany();

  console.log('Quantidade de produtos: ', products.length);

  return { products };
});

app
  .listen({
    port: Number(process.env.PORT) ?? 3333,
    host: '0.0.0.0'
  })
  .then(() => {
    console.log('Server is running...');
  });
