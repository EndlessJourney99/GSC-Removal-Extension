# DOCUMENT

## 1. Requirement
- Cài đặt nodejs và npm
- Tại folder root của source code, chạy câu lệnh :  
    > `npm install`
---
## 2. Môi trường Dev
- Tại folder root của source code, chạy câu lệnh :
    > `npm run dev`
- Câu lệnh trên sẽ chạy server dev và tạo folder dist ở root folder của source code.
- Vào trang cài đặt extension của **chrome** hoặc bất kỳ browser nào sử dụng chromium và bật chế độ dành cho nhà phát triển.  
    > *VD trong chrome sẽ là **chrome://extensions/***
- Chọn **Tải lên tiện ích đã giải nén** và chọn tải lên folder **dist** vừa được gen ra từ câu lệnh `npm run dev`.
> #### **NOTE** : Khi nhấn vào extension có thể sẽ hiện ra popup báo đang chờ background service. Lúc này nhấn chuột phải vào popup và chọn `inspect` để mở dev tool, sau đó bấm f5 để load lại background service.
> - Trong trường hợp vẫn hiện lên popup báo chờ BG service như trước thì có thể code bị lỗi, cần xem trang báo lỗi extension của chrome để debug.
---
## 3. Production
- Tại trang folder root của source code, chạy câu lệnh : 
    > `npm run build`
- Câu lệnh này sẽ chạy unit test cho các Audit Checklist function, nếu pass hết test sẽ tiến hành build project.
- Nếu test bị fail, cần sửa lại code để test chạy đúng trước khi có thể build.
- Code sau khi build xong sẽ nằm trong folder **dist** ở root folder.
- Có thể làm như các bước ở môi trường Dev để tải extension lên local, hoặc có thể zip folder **dist** này lại để upload lên google chrome store.
---
## 4. Manifest.json
File manifest.json ở root folder chứa meta data của extension. Các thông tin có thể chỉnh sửa như : 
- Name
- Description
- Version *(Tăng số version lên mỗi khi update lên google chrome store)*
- Icons
- Action Default_Title *(title hiện lên khi hover vào icon của extension)*