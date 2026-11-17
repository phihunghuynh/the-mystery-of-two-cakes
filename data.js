/* Shared question bank and scoring configuration.
   The option tags and scoring weights are private implementation data.
   Weights are heuristic, informed by official product descriptions; see docs/CAKE_RESEARCH.md. */
window.MYSTERY = (() => {
  const q = (id, title, options, note="") => ({id,title,options,note});
  const o = (label, tag=null) => ({label,tag});
  const moods = {
    happy: {
      label:"Đang vui, tỉnh táo",
      title:"The Golden Mind",
      questions:[
        q("G1","Nếu được bước vào một thế giới tưởng tượng, bạn chọn nơi nào?",[o("Vương quốc ánh nắng","S"),o("Khu rừng xanh bí ẩn","G"),o("Thành phố ánh đèn rực rỡ","X"),o("Một hòn đảo nhiệt đới","F")]),
        q("G2","Một vật thể có cấu trúc nhiều lớp. Bạn tò mò điều gì nhất?",[o("Lớp ngoài cùng","P"),o("Phần lõi bên trong","K"),o("Cách các lớp kết hợp","X"),o("Cảm giác khi chạm vào","Y")]),
        q("G3","Một số có hai chữ số, tổng hai chữ số bằng 9 và chữ số hàng chục hơn hàng đơn vị 3 đơn vị. Số đó là?",[o("36"),o("45"),o("63"),o("72")],"Đáp án: 63."),
        q("G4","Nếu phải chọn một phẩm chất của nhân vật chính?",[o("Ấm áp","S"),o("Sắc sảo","G"),o("Bí ẩn","X"),o("Phóng khoáng","F")]),
        q("G5","Bạn muốn lưu giữ loại ký ức nào?",[o("Một khoảnh khắc ngọt ngào","S"),o("Một trải nghiệm đậm dấu ấn","K"),o("Một ngày mới lạ","F"),o("Một buổi chiều bình yên","Y")]),
        q("G6","Dãy số: 2, 6, 12, 20, 30, ?",[o("36"),o("40"),o("42"),o("44")],"Đáp án: 42."),
        q("G7","Nếu có thể tạo ra một phát minh nhỏ, bạn muốn nó mang đặc điểm nào?",[o("Khiến mọi thứ dễ chịu hơn","Y"),o("Tạo ra điều bất ngờ","F"),o("Có thiết kế tinh tế","G"),o("Giúp cuộc sống đơn giản hơn","M")])
      ]
    },
    normal: {
      label:"Bình thường",
      title:"The Balanced Explorer",
      questions:[
        q("B1","Bạn thích một buổi chiều như thế nào?",[o("Nắng nhẹ","S"),o("Trời se lạnh","G"),o("Sau cơn mưa","Y"),o("Một ngày đầy màu sắc","F")]),
        q("B2","Trong một chuyến đi, bạn ưu tiên điều gì?",[o("Sự quen thuộc","M"),o("Khám phá điều mới","F"),o("Sự tiện lợi","Y"),o("Những trải nghiệm đáng nhớ","X")]),
        q("B3","Một số tự nhiên có tổng chữ số bằng 12. Nó chắc chắn chia hết cho số nào?",[o("2"),o("3"),o("5"),o("9")],"Đáp án: 3."),
        q("B4","Nếu chọn một vật trang trí cho bàn học?",[o("Một chiếc đèn ấm áp","S"),o("Một chậu cây xanh","G"),o("Một món đồ độc đáo","X"),o("Một vật nhỏ xinh","P")]),
        q("B5","Bạn thích một trải nghiệm có đặc điểm nào?",[o("Nhẹ nhàng","Y"),o("Đậm nét","K"),o("Hài hòa","G"),o("Khác biệt","F")]),
        q("B6","Nếu phải chọn một trong bốn phong cách?",[o("Tối giản","M"),o("Cổ điển","X"),o("Hiện đại","G"),o("Sáng tạo","F")]),
        q("B7","Một kế hoạch có 4 bước. Bạn sẽ?",[o("Theo đúng trình tự"),o("Linh hoạt"),o("Tìm bước quan trọng nhất"),o("Tìm cách tối ưu")])
      ]
    },
    sad: {
      label:"Muốn nhẹ nhàng",
      title:"The Gentle Escape",
      questions:[
        q("S1","Nếu hôm nay là một màu sắc?",[o("Vàng kem","S"),o("Xanh lá","G"),o("Nâu ấm","M"),o("Hồng pastel","F")]),
        q("S2","Bạn muốn bước vào không gian nào?",[o("Một căn phòng ấm áp","S"),o("Một khu vườn thoáng đãng","F"),o("Một quán nhỏ yên tĩnh","X"),o("Một nơi có ánh đèn lung linh","P")]),
        q("S3","Một người bạn nói: “Không cần phải vui ngay đâu, cứ từ từ nhé.” Điều gì khiến bạn thấy dễ chịu nhất?",[o("Được lắng nghe"),o("Có người ở cạnh"),o("Có một bất ngờ nhỏ"),o("Có thời gian riêng")]),
        q("S4","5 + 5 × 2 bằng bao nhiêu?",[o("15"),o("20"),o("25"),o("30")],"Đáp án: 15."),
        q("S5","Nếu được chọn một âm thanh?",[o("Tiếng mưa","X"),o("Tiếng gió","F"),o("Nhạc nhẹ","Y"),o("Tiếng cười","M")]),
        q("S6","Bạn muốn kết thúc một ngày bằng cảm giác nào?",[o("Được an ủi","S"),o("Được làm mới","F"),o("Bình yên","Y"),o("Có điều đáng nhớ","X")])
      ]
    },
    tired: {
      label:"Mệt hoặc đau đầu",
      title:"The Silent Mode",
      questions:[
        q("T1","Chọn một con số.",[o("2","S"),o("3","G"),o("5","K"),o("8","F")]),
        q("T2","Chọn một hình dạng.",[o("Tròn","P"),o("Vuông","M"),o("Tam giác","G"),o("Ngôi sao","X")]),
        q("T3","Nếu được nghỉ 15 phút?",[o("Nhắm mắt"),o("Nghe nhạc"),o("Ngắm cảnh"),o("Lướt điện thoại")]),
        q("T4","Chọn một từ nghe dễ chịu.",[o("Dịu dàng","S"),o("Ấm áp","M"),o("Thanh mát","Y"),o("Rực rỡ","F")])
      ]
    },
    random: {
      label:"Để bất ngờ quyết định",
      title:"The Random Dimension",
      questions:[
        q("R1","Chọn một biểu tượng.",[o("Mặt trời","S"),o("Mặt trăng","G"),o("Cầu vồng","F"),o("Ngôi sao","X")]),
        q("R2","Dãy Fibonacci: 1, 1, 2, 3, 5, 8, ?",[o("11"),o("12"),o("13"),o("15")],"Đáp án: 13."),
        q("R3","Nếu có một siêu năng lực?",[o("Dừng thời gian","X"),o("Đọc suy nghĩ","P"),o("Dịch chuyển","F"),o("Tạo bất ngờ","M")]),
        q("R4","Chọn một từ.",[o("Dịu dàng","Y"),o("Rực rỡ","K"),o("Thanh mát","F"),o("Ấm áp","S")]),
        q("R5","Một món đồ có 3 lớp bảo vệ. Bạn muốn kiểm tra?",[o("Lớp đầu","P"),o("Lớp giữa","K"),o("Lớp cuối","X"),o("Tất cả","G")]),
        q("R6","Bạn thích một kết thúc như thế nào?",[o("Nhẹ nhàng","Y"),o("Bất ngờ","F"),o("Đáng nhớ","X"),o("Hài hước","M")])
      ]
    }
  };

  const cakes = [
    {code:"caramel_cheese",name:"Bánh phô mai caramel",weights:{S:3,Y:1}},
    {code:"green_tea_cheese",name:"Bánh phô mai trà xanh",weights:{G:3,Y:1}},
    {code:"cocoa_mousse",name:"Mousse cacao",weights:{S:1,K:3}},
    {code:"banana",name:"Bánh chuối",weights:{M:3,Y:1}},
    {code:"passion_cheese",name:"Bánh phô mai chanh dây",weights:{S:1,F:3}},
    {code:"yogurt_cheese",name:"Bánh sữa chua phô mai",weights:{S:1,Y:3}},
    {code:"tiramisu",name:"Bánh tiramisu",weights:{S:1,K:2,X:2}},
    {code:"strawberry_cup",name:"Bánh kem hương dâu (lon)",weights:{F:2,Y:1,P:2}},
    {code:"tiramisu_cup",name:"Bánh kem tiramisu (lon)",weights:{S:1,K:2,X:2,P:2}}
  ];

  const stores = [
    {id:"vtv",name:"Highlands VTV Huế",shipping:18000,cakes:["caramel_cheese","green_tea_cheese","cocoa_mousse","tiramisu_cup","strawberry_cup"]},
    {id:"vincom",name:"Highlands Vincom Huế",shipping:18000,cakes:["strawberry_cup","passion_cheese","yogurt_cheese","caramel_cheese","green_tea_cheese","cocoa_mousse","banana"]},
    {id:"pham_van_dong",name:"Highlands 102 Phạm Văn Đồng",shipping:19000,cakes:["banana","caramel_cheese","green_tea_cheese","cocoa_mousse","tiramisu","tiramisu_cup","strawberry_cup"]}
  ];

  const tagNames = {S:"Ngọt & béo",G:"Thanh nhẹ / trà xanh",K:"Cacao",F:"Trái cây / chua ngọt",M:"Vị quen thuộc",Y:"Dịu nhẹ",X:"Nhiều tầng hương vị",P:"Bánh dạng lon"};
  const moodNames = {happy:"Vui, tỉnh táo",normal:"Bình thường",sad:"Muốn nhẹ nhàng",tired:"Mệt / đau đầu",random:"Ngẫu nhiên"};
  return {moods,cakes,stores,tagNames,moodNames};
})();