import nodemailer from "nodemailer";
import path from "path";

export async function POST(req) {
  try {
    const body = await req.json();

    // Destructure form data (new fields only)
    const { name, email, subject, message } = body;

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Inline images (optional)
    const attachments = [
      {
        filename: "website-logo-trans.png",
        path: path.join(
          process.cwd(),
          "public/images",
          "website-logo-trans.png"
        ),
        cid: "moslogo",
      },
      {
        filename: "website-logo-trans.png",
        path: path.join(
          process.cwd(),
          "public/images",
          "website-logo-trans.png"
        ),
        cid: "mosfooterlogo",
      },
    ];

    // Email to Admin/HR
    const hrMailOptions = {
      from: `"${name}" <${email}>`,
      to: "atz.softprgmr@gmail.com", // change to your email
      subject: `Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <img src="cid:moslogo" alt="MOS Logo" style="height: 30px;" />
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong><br>${message}</p>
          <br />
          <img src="cid:mosfooterlogo" alt="MOS Footer Logo" style="height: 38px;" />
        </div>
      `,
      attachments,
    };

    // Thank-you email to user
    const thankYouMailOptions = {
      from: `Nemesis Asset Management <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank You for Contacting Us!",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #4B4B4B;background-color:#4B4B4B">
          <!-- Header Section -->
          <table width="100%" style="border-collapse: collapse;">
            <tr>
              <td align="left">
                 <img src="cid:moslogo" alt="Nemesis Asset Management" style="height: 100px">
              </td>
              <td align="right">
                <!-- Empty right section -->
              </td>
            </tr>
          </table>
          
          <!-- Middle Section -->
          <h1 style="text-align: center; color: #ffffff; font-size: 24px; font-weight: 300; font-family:inter, serif">Thank You for contacting Nemesis Asset Management</h1>
          <p style="font-size: 16px; color: #ffffff; text-align: center;">
            We would like to inform you that we have recieved your email and a member of our team will get back to you as soon as possible
          </p>
         
          
          <!-- Footer Section -->
          <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
          <table width="100%" style="border-collapse: collapse;">
            <tr>
              <td align="left" style="font-size:14px; color:#ffffff; font-weight:300;">
                   <strong style="font-size:14px; color:#ffffff; font-weight:300;">Nemesis Asset Management</strong><br>
                     <a href="#" style="color:#ffffff; text-decoration:none;">53 Davies Street,</a><br>
                     <a href="#" style="color:#ffffff; text-decoration:none;">London W1K 5JH.</a><br>
                    </td>
              <td align="right">
                <img src="cid:mosfooterlogo" alt="Mos Letter Logo" style="height: 70px;" />
              </td>
            </tr>
          </table>
        </div>
      `,
      attachments,
    };

    // Send both mails
    await transporter.sendMail(hrMailOptions);
    await transporter.sendMail(thankYouMailOptions);

    return new Response(
      JSON.stringify({ success: true, message: "Emails sent successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to send email." }),
      { status: 500 }
    );
  }
}
