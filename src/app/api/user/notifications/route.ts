import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';
import { z } from 'zod';

// Notification settings validation schema
const notificationSettingsSchema = z.object({
  // Email notifications
  emailNewOffers: z.boolean().optional(),
  emailRequestUpdates: z.boolean().optional(),
  emailMessages: z.boolean().optional(),
  emailMarketing: z.boolean().optional(),
  emailSecurityAlerts: z.boolean().optional(),
  
  // Push notifications
  pushNewOffers: z.boolean().optional(),
  pushRequestUpdates: z.boolean().optional(),
  pushMessages: z.boolean().optional(),
  
  // SMS notifications
  smsSecurityAlerts: z.boolean().optional(),
  smsMarketing: z.boolean().optional(),
});

/**
 * GET /api/user/notifications
 * Get user notification settings
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'You must be logged in to view notification settings.',
        },
        { status: 401 }
      );
    }

    // Get or create notification settings
    let settings = await prisma.notificationSettings.findUnique({
      where: { userId: session.user.id },
    });

    if (!settings) {
      // Create default settings
      settings = await prisma.notificationSettings.create({
        data: {
          userId: session.user.id,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          settings: {
            // Email
            emailNewOffers: settings.emailNewOffers,
            emailRequestUpdates: settings.emailRequestUpdates,
            emailMessages: settings.emailMessages,
            emailMarketing: settings.emailMarketing,
            emailSecurityAlerts: settings.emailSecurityAlerts,
            // Push
            pushNewOffers: settings.pushNewOffers,
            pushRequestUpdates: settings.pushRequestUpdates,
            pushMessages: settings.pushMessages,
            // SMS
            smsSecurityAlerts: settings.smsSecurityAlerts,
            smsMarketing: settings.smsMarketing,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get notification settings error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'server.error',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/notifications
 * Update user notification settings
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'You must be logged in to update notification settings.',
        },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = notificationSettingsSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'validation.failed',
          message: 'Please check your input and try again.',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const settingsData = validationResult.data;

    // Upsert notification settings
    const settings = await prisma.notificationSettings.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        ...settingsData,
      },
      update: settingsData,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Notification settings updated successfully.',
        data: {
          settings: {
            emailNewOffers: settings.emailNewOffers,
            emailRequestUpdates: settings.emailRequestUpdates,
            emailMessages: settings.emailMessages,
            emailMarketing: settings.emailMarketing,
            emailSecurityAlerts: settings.emailSecurityAlerts,
            pushNewOffers: settings.pushNewOffers,
            pushRequestUpdates: settings.pushRequestUpdates,
            pushMessages: settings.pushMessages,
            smsSecurityAlerts: settings.smsSecurityAlerts,
            smsMarketing: settings.smsMarketing,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update notification settings error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'server.error',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}
