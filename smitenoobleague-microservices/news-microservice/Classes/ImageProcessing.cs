using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace news_microservice.Classes
{
    public static class ImageProcessing
    {
        //base processsing functions
        public static Bitmap ResizeImage(Image image, int width, int height)
        {
            var destRect = new Rectangle(0, 0, width, height);
            var destImage = new Bitmap(width, height);

            destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

            using (var graphics = Graphics.FromImage(destImage))
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

                using (var wrapMode = new ImageAttributes())
                {
                    wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                    graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
                }
            }

            return destImage;
        }
        public static bool IsImage(IFormFile postedFile)
        {
            //-------------------------------------------
            //  Check the image mime types
            //-------------------------------------------
            if (!string.Equals(postedFile.ContentType, "image/jpg", StringComparison.OrdinalIgnoreCase) &&
                !string.Equals(postedFile.ContentType, "image/jpeg", StringComparison.OrdinalIgnoreCase) &&
                !string.Equals(postedFile.ContentType, "image/pjpeg", StringComparison.OrdinalIgnoreCase) &&
                !string.Equals(postedFile.ContentType, "image/gif", StringComparison.OrdinalIgnoreCase) &&
                !string.Equals(postedFile.ContentType, "image/x-png", StringComparison.OrdinalIgnoreCase) &&
                !string.Equals(postedFile.ContentType, "image/png", StringComparison.OrdinalIgnoreCase))
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        //Byte array conversion and string 64
        public static string ByteArrayToString64(byte[] pic)
        {
            var base64 = Convert.ToBase64String(pic);
            var string64image = string.Format("data:image/gif;base64,{0}", base64);
            return string64image;
        }
        public static byte[] ImageToByteArray(Image imageIn)
        {
            MemoryStream ms = new MemoryStream();
            imageIn.Save(ms, ImageFormat.Png);
            return ms.ToArray();
        }
        public static async Task<byte[]> FormFileToResizedByteArrayAsync(IFormFile file)
        {
            if (file != null)
            {
                if (IsImage(file))
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await file.CopyToAsync(memoryStream);

                        using (var img = Image.FromStream(memoryStream))
                        {
                            var sizedImg = ResizeImage(img, 400, 400);
                            return ImageToByteArray(sizedImg);
                        }
                    }
                }
                else
                {
                    return default;
                }
            }
            else
            {
                return default;
            }
        }
        //File system saving and deleting
        public static async Task<string> SaveImageAsync(IFormFile file, string imgName, IWebHostEnvironment env)
        {
            if (IsImage(file))
            {
                DateTime date = DateTime.UtcNow;
                string imageName = $"{date:yyyyMMddHHmmss}_{imgName}.png"; //datetime in the save parameter for cache busting
                string filePath = Path.Combine(env.ContentRootPath, "images");

                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);

                    using (var img = Image.FromStream(memoryStream))
                    {
                        //convert image to png
                        MemoryStream ms = new MemoryStream();
                        img.Save(ms, ImageFormat.Png);
                        ms.Seek(0, SeekOrigin.Begin);
                        //resize the image to 400 by 400
                        var sizedImg = ResizeImage(Image.FromStream(ms), 1920, 1080);
                        MemoryStream ms2 = new MemoryStream();
                        sizedImg.Save(ms2, ImageFormat.Png);
                        ms2.Seek(0, SeekOrigin.Begin);


                        // Then save the image
                        using (var fileStream = new FileStream(Path.Combine(filePath, imageName), FileMode.Create))
                        {
                            await ms2.CopyToAsync(fileStream);
                        }
                    }
                }
                return imageName;
            }
            else
            {
                return null;
            }
        }
        public static void DeleteImageAsync(string imgName, IWebHostEnvironment env)
        {
            string filePath = Path.Combine(env.ContentRootPath, "images", imgName);

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }
}
