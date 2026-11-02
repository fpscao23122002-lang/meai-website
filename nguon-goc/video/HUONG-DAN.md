# Thư mục video gốc

Tải video thành phẩm tạo bằng MeAI vào **thư mục này** (`nguon-goc/video/`). Thư mục không được đưa lên website; Claude sẽ:

- nén lại cho web (MP4 H.264 + WebM, 720p/1080p, thường còn 1–4 MB/clip);
- tạo ảnh bìa (poster);
- gắn video vào đúng chỗ trên web;
- xoá file gốc khỏi đây để repo nhẹ.

## Cách tải lên (trên GitHub, không cần cài gì)

1. Mở repo trên GitHub, vào thư mục `nguon-goc/video/`.
2. Bấm **Add file → Upload files**, kéo thả video vào.
   - Mỗi file **tối đa 25 MB**. GitHub web không nhận file lớn hơn; file lớn thì cắt ngắn hoặc xuất bitrate thấp hơn.
3. Ở ô commit, chọn **Commit directly to the main branch** (hoặc tạo nhánh mới) rồi bấm **Commit changes**.
4. Nhắn Claude: "đã up video".

## Đặt tên file theo chỗ muốn gắn

| Tiền tố | Gắn vào | Khổ khuyên dùng |
|---|---|---|
| `hero-` | Video nền / trình chiếu đầu trang | 16:9, 10–20 giây |
| `muse-`, `flow-`, `seedance-` | Thẻ tính năng của từng engine | 9:16 hoặc 16:9 |
| `ugc-` | Ứng dụng: Video UGC / review sản phẩm | 9:16 |
| `phim-` | Ứng dụng: Phim AI xây kênh | 16:9 |
| `affiliate-` | Ứng dụng: Video affiliate TikTok / Shopee | 9:16 |
| `prompt-<tên>` | Kết quả minh hoạ cho prompt mẫu cùng tên | đúng khổ của prompt |

Ví dụ: `ugc-serum-01.mp4`, `phim-lang-tuyet-01.mp4`, `hero-01.mp4`.

**Nên kèm** một file `ghi-chu.txt` liệt kê: tên file, engine (Muse / Flow / Seedance), và prompt đã dùng.
Website sẽ hiện "prompt gốc" bên cạnh video, giống bằng chứng thật.

## Lưu ý nội dung

- Không dùng gương mặt người nổi tiếng hoặc người thật khi chưa được đồng ý.
- Không dùng nhạc có bản quyền: video trên web tự phát ở chế độ tắt tiếng.
- Cắt bỏ logo hoặc watermark của nền tảng nếu có thể.

## Video đang dùng trên web (`public/videos/`)

| File web | Nguồn | Vị trí |
|---|---|---|
| `intro-1.mp4`, `intro-2.mp4` | videointro1, videointro2 (16:9) | Phim nền đầu trang — phát nối tiếp, lặp vô hạn |
| `ugc-nuoc-hoa.mp4` | video2 | Ứng dụng 01 · Review nước hoa |
| `ugc-thoi-trang.mp4` | video1 | Ứng dụng 01 · Lookbook dạo phố |
| `phim-hoi-uc.mp4` | video4 | Ứng dụng 02 · Phim cảm xúc |
| `phim-kiem-dao.mp4` | video5 | Ứng dụng 02 · Phim hành động |
| `mua-le-den-noel.mp4` | video3 | Ứng dụng 03 · Đèn trang trí Noel |
| `mua-le-gia-dinh.mp4` | video6 | Ứng dụng 03 · Samoyed đón Noel |

Mỗi video có ảnh bìa `.webp` cùng tên. Video gốc đã được nén (H.264, giữ 720p) và xoá khỏi thư mục này.
