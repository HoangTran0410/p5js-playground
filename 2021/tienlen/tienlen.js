class LaBai {
    constructor(so, chat, x = 0, y = 0, w = 60, h = 90) {
        this.so = so;
        this.chat = chat;

        this.sap = false; // sấp - bài sấp(true) hay ngửa(false)

        this.x = width / 2;
        this.y = height / 2;
        this.w = w;
        this.h = h;

        this.a = random(360);
        this.x2 = x || random(width);
        this.y2 = y || random(height);
    }

    tinhToan() {
        this.x = lerp(this.x, this.x2, 0.1);
        this.y = lerp(this.y, this.y2, 0.1);
    }

    diChuyenToi(x, y) {
        this.x2 = x;
        this.y2 = y;
    }

    hienThi() {
        let { x, y } = this;
        let { w, h } = this;

        push();
        translate(x, y);
        rotate(radians(this.a));

        if (this.sap) {
            fill(150);
            stroke(0);
            strokeWeight(2);
            rect(0, 0, w, h, 5);

            stroke(175);
            strokeWeight(3);
            line(-w / 2 + 5, -h / 2 + 5, w / 2 - 5, h / 2 - 5);
            line(w / 2 - 5, -h / 2 + 5, -w / 2 + 5, h / 2 - 5);
        } else {
            fill(255);
            stroke(30);
            strokeWeight(2);
            rect(0, 0, w, h, 5);

            noStroke();
            if (this.chat == '♥' || this.chat == '♦') fill('red');
            else fill('black');

            textSize(25);
            textAlign(LEFT, TOP);
            text(this.so, -w / 2 + 5, -h / 2 + 5);
            text(this.chat, -w / 2 + 5, -h / 2 + 30);
            // text(this.a, 0, 0);
        }

        pop();
    }

    toSang() {
        let { x, y } = this;
        let { w, h } = this;

        push();
        translate(x, y);
        rotate(radians(this.a));

        noFill();
        stroke('yellow');
        strokeWeight(4);
        rect(0, 0, w, h, 5);

        pop();
    }
}

class TienLen {
    // số của bài - từ cao tới thấp
    static SO = [2, 'A', 'K', 'Q', 'J', 10, 9, 8, 7, 6, 5, 4, 3];
    // chất của bài - từ cao tới thấp
    static CHAT = ['♥', '♦', '♠', '♣'];

    constructor() {
        this.bobai = []; // bộ bài - tất cả lá bài
        this.conlai = []; // còn lại - chứa lá bài chưa chia
        this.dadanh = []; // đã đánh - chứa lá bài đã đánh
        this.nguoichoi = []; // người chơi
        this.luotchoi = 0;

        this.labaidangchon = null; // lá bài đang chọn
    }

    // tính toán
    tinhToan() {
        for (let lb of this.bobai) {
            lb.tinhToan();
        }
    }

    // hiển thị
    hienThi() {
        for (let lb of this.bobai) {
            lb.hienThi();
        }

        // this.bobai[0].hienThi();

        // this.dangchon(this.bobai[0]);
    }

    // ván mới
    vanMoi() {
        this.bobai = [];
        this.dadanh = [];
        this.labaidangchon = null;

        for (let so of TienLen.SO) {
            for (let chat of TienLen.CHAT) {
                this.bobai.push(new LaBai(so, chat));
            }
        }

        for (let lb of this.bobai) {
            this.conlai.push(lb);
        }

        this.xaoBai();
        this.chiaBai();
    }

    // xào bài
    xaoBai() {
        shuffleArray(this.conlai);
    }

    // chia bài
    chiaBai() {
        for (let i = 0; i < 13; i++) {
            for (let nc of this.nguoichoi) {
                nc.labai.push(this.conlai.shift());
            }
        }
    }

    // thêm người vào ván
    themNguoi(ten) {
        if (this.nguoichoi.length < 4) {
            this.nguoichoi.push({
                ten: ten,
                labai: [],
            });
        }
    }

    // so sánh lá bài
    soSanh(labai1, labai2) {
        let so1i = TienLen.SO.indexOf(labai1.so);
        let so2i = TienLen.SO.indexOf(labai2.so);
        let chat1i = TienLen.CHAT.indexOf(labai1.chat);
        let chat2i = TienLen.CHAT.indexOf(labai2.chat);

        if (so1i == -1 || so2i == -1 || chat1i == -1 || chat2i == -1)
            return null;

        if (so1i < so2i) {
            return 1;
        } else if (so1i > so2i) {
            return -1;
        } else if (chat1i < chat2i) {
            return 1;
        } else if (chat1i > chat2i) {
            return -1;
        } else return 0;
    }

    // kiểm tra xem chuột có đang chọn labai hay không
    dangchon(labai) {
        let hovered = testRectangleToPoint(
            labai.w,
            labai.h,
            labai.a + 90,
            labai.x,
            labai.y,
            mouseX,
            mouseY
        );

        hovered && labai.toSang();
    }
}
