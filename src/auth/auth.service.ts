import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async login(loginDto: LoginDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: loginDto.email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: admin.id, email: admin.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    };
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email: createAdminDto.email },
    });
    if (existingAdmin) {
      throw new ConflictException('Admin with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const admin = await this.prisma.admin.create({
      data: {
        email: createAdminDto.email,
        password: hashedPassword,
        name: createAdminDto.name,
      },
    });

    await this.mailService.sendMail({
      to: admin.email,
      subject: '🎉 Your Admin Account Has Been Created',
      text: `Hello ${admin.name}, your Ad manager admin account has been created.`,
      html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Account Created</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 0;">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background:#4f46e5; padding:24px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:24px;">
                  Admin Account Created
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px; color:#333333;">
                <p style="font-size:16px; margin:0 0 16px;">
                  Hello <strong>${admin.name}</strong>,
                </p>

                <p style="font-size:16px; line-height:1.6; margin:0 0 24px;">
                  Your admin account has been successfully created.  
                  You can now access the admin dashboard and manage the system.
                </p>

                <div style="text-align:center; margin:32px 0;">
                  <a href="https://adventure-hub-ochre.vercel.app/"
                     style="
                       background:#4f46e5;
                       color:#ffffff;
                       text-decoration:none;
                       padding:12px 24px;
                       border-radius:6px;
                       font-size:16px;
                       display:inline-block;
                     ">
                    Login to Dashboard
                  </a>
                </div>

                <p style="font-size:14px; color:#666666; margin:0;">
                  If you did not expect this email, please contact support immediately.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f4f6f8; padding:16px; text-align:center;">
                <p style="font-size:12px; color:#999999; margin:0;">
                  © ${new Date().getFullYear()} Your Company. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
    });

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    };
  }

  async validateUser(userId: string) {
    return this.prisma.admin.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }
}
