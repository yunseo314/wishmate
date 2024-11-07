// 전역 변수로 현재 사용자 정보 설정
const currentUser = {
    id: 'user1',
    name: '사용자'
};

// 위시리스트 가져오기
function getWishlist() {
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
}

// 모달 열기
function showAddItemForm() {
    document.getElementById('addItemModal').style.display = 'block';
}

// 아이템 추가 함수 (단순화된 버전)
function addItem() {
    const url = document.getElementById('itemUrl').value;
    const price = document.getElementById('itemPrice').value;
    const category = document.getElementById('category').value;
    
    if (!url || !price) {
        alert('URL과 가격을 모두 입력해주세요!');
        return;
    }

    // 새 아이템 생성
    const newItem = {
        id: Date.now().toString(),
        url: url,
        price: Number(price).toLocaleString() + '원',
        category: category,
        // 임시 이미지 사용 (실제로는 입력받은 URL의 이미지를 사용하고 싶었으나 CORS 이슈로 인해)
        image: 'https://via.placeholder.com/300',
        title: '내 위시 아이템',
        description: url,
        userId: currentUser.id,
        userName: currentUser.name,
        date: new Date().toISOString()
    };

    // 기존 위시리스트에 추가
    const wishlist = getWishlist();
    wishlist.push(newItem);
    
    // 저장
    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    // 모달 닫기
    document.getElementById('addItemModal').style.display = 'none';
    
    // 입력 필드 초기화
    document.getElementById('itemUrl').value = '';
    document.getElementById('itemPrice').value = '';
    
    // 화면 새로고침
    displayMonthlyWishlist();
    
    alert('위시리스트에 추가되었습니다!');
}

// 월별 위시리스트 표시
function displayMonthlyWishlist() {
    const wishlist = getWishlist();
    const currentMonth = new Date().getMonth();
    
    const monthlyItems = wishlist.filter(item => {
        const itemMonth = new Date(item.date).getMonth();
        return itemMonth === currentMonth;
    });

    const grid = document.getElementById('wishlistGrid');
    
    grid.innerHTML = monthlyItems.map(item => `
        <div class="wishlist-item" onclick="showItemDetail('${item.id}')">
            <img src="${item.image}" alt="제품 이미지">
            <div class="item-info">
                <span class="category">${item.category}</span>
                <span class="price">${item.price}</span>
            </div>
            <div class="user-info">
                ${item.userName}
            </div>
        </div>
    `).join('');
}

// 아이템 상세 정보 표시
function showItemDetail(itemId) {
    const wishlist = getWishlist();
    const item = wishlist.find(i => i.id === itemId);
    
    const detailModal = document.getElementById('detailModal');
    const detailContent = document.getElementById('itemDetail');
    
    detailContent.innerHTML = `
        <img src="${item.image}" alt="제품 이미지">
        <h3>${item.title}</h3>
        <p class="price">${item.price}</p>
        <p>카테고리: ${item.category}</p>
        <p>등록자: ${item.userName}</p>
        <a href="${item.url}" target="_blank" class="product-link">제품 보러가기</a>
    `;
    
    detailModal.style.display = 'block';
}

// 모달 닫기
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = function() {
        this.parentElement.parentElement.style.display = 'none';
    }
});

// 페이지 로드시 실행
window.onload = displayMonthlyWishlist; 