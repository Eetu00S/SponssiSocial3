// Sponssi Social - JavaScript functionality

class SponssiSocial {
    constructor() {
        const fromConfig = (typeof window !== 'undefined' && window.SPONSSI_API_BASE) ? window.SPONSSI_API_BASE : '';
        this.apiBase = fromConfig || (window.location.origin.includes('localhost') ? 'http://localhost:3000' : '');
        this.articles = [];
        this.currentArticleId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTheme();
        this.bootstrapData();
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Publish modal
        document.getElementById('publishBtn').addEventListener('click', () => {
            this.showModal('publishModal');
        });

        document.getElementById('modalClose').addEventListener('click', () => {
            this.hideModal('publishModal');
        });

        document.getElementById('cancelPublish').addEventListener('click', () => {
            this.hideModal('publishModal');
        });

        // Comment modal
        document.getElementById('commentModalClose').addEventListener('click', () => {
            this.hideModal('commentModal');
        });

        document.getElementById('cancelComment').addEventListener('click', () => {
            this.hideModal('commentModal');
        });

        // Forms
        document.getElementById('publishForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.publishArticle();
        });

        document.getElementById('commentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addComment();
        });

        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleNavigation(e.target.dataset.section);
            });
        });

        // Category filters
        document.querySelectorAll('.category-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.filterByCategory(e.target.dataset.category);
            });
        });

        // Sort select
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.sortArticles(e.target.value);
        });

        // Modal backdrop clicks
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
    }

    // Theme management
    toggleTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle.querySelector('i');

        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            icon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark-mode');
            icon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        }
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle.querySelector('i');

        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            icon.className = 'fas fa-sun';
        } else {
            document.body.classList.remove('dark-mode');
            icon.className = 'fas fa-moon';
        }
    }

    // Modal management
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // Clear form if it's a form modal
        if (modalId === 'publishModal') {
            document.getElementById('publishForm').reset();
        } else if (modalId === 'commentModal') {
            document.getElementById('commentForm').reset();
        }
    }

    // Data bootstrap: online -> API, offline -> localStorage sample
    async bootstrapData() {
        try {
            const fromApi = await this.fetchArticlesFromApi();
            if (fromApi && Array.isArray(fromApi)) {
                this.articles = fromApi;
                this.renderArticles();
                return;
            }
        } catch (e) {
            // fall back
        }
        // Try static file on GitHub Pages
        try {
            const fromStatic = await this.fetchFromStaticFile();
            if (fromStatic && Array.isArray(fromStatic)) {
                this.articles = fromStatic;
                this.renderArticles();
                return;
            }
        } catch (e) {}
        this.articles = this.loadArticles();
        if (this.articles.length === 0) {
            this.addSampleData();
            this.articles = this.loadArticles();
        }
        this.renderArticles();
    }

    async fetchArticlesFromApi() {
        if (!this.apiBase) return null;
        const res = await fetch(this.apiBase + '/api/articles');
        if (!res.ok) throw new Error('api');
        return await res.json();
    }

    async fetchFromStaticFile() {
        const res = await fetch('posts.json', { cache: 'no-store' });
        if (!res.ok) return null;
        const data = await res.json();
        return Array.isArray(data?.articles) ? data.articles : null;
    }

    // Article management
    publishArticle() {
        const formData = new FormData(document.getElementById('publishForm'));
        const article = {
            id: Date.now().toString(),
            author: formData.get('authorName'),
            title: formData.get('articleTitle'),
            category: formData.get('articleCategory'),
            content: formData.get('articleContent'),
            date: new Date().toISOString(),
            likes: 0,
            comments: [],
            liked: false
        };

        this.createArticle(article)
            .catch(() => {
                this.articles.unshift(article);
                this.saveArticles();
                // Also update posts.json guidance: user can export below
            })
            .finally(() => {
                this.bootstrapData();
                this.hideModal('publishModal');
                this.showNotification('Artikkeli julkaistu onnistuneesti!', 'success');
            });
    }

    async createArticle(article) {
        if (!this.apiBase) throw new Error('no api');
        const res = await fetch(this.apiBase + '/api/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                author: article.author,
                title: article.title,
                category: article.category,
                content: article.content,
            }),
        });
        if (!res.ok) throw new Error('api');
        return await res.json();
    }

    addComment() {
        if (!this.currentArticleId) return;

        const formData = new FormData(document.getElementById('commentForm'));
        const comment = {
            id: Date.now().toString(),
            author: formData.get('commentAuthor'),
            content: formData.get('commentContent'),
            date: new Date().toISOString()
        };

        const article = this.articles.find(a => a.id === this.currentArticleId);
        if (article) {
            this.addCommentApi(article.id, comment)
                .catch(() => {
                    article.comments.push(comment);
                    this.saveArticles();
                })
                .finally(() => {
                    this.bootstrapData();
                    this.hideModal('commentModal');
                    this.showNotification('Kommentti lisätty onnistuneesti!', 'success');
                });
        }
    }

    async addCommentApi(articleId, comment) {
        if (!this.apiBase) throw new Error('no api');
        const res = await fetch(this.apiBase + `/api/articles/${articleId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author: comment.author, content: comment.content }),
        });
        if (!res.ok) throw new Error('api');
        return await res.json();
    }

    toggleLike(articleId) {
        const article = this.articles.find(a => a.id === articleId);
        if (article) {
            fetch(this.apiBase ? this.apiBase + `/api/articles/${articleId}/like` : '', { method: 'POST' })
                .catch(() => {
                    article.likes += 1;
                    this.saveArticles();
                })
                .finally(() => this.bootstrapData());
        }
    }

    showComments(articleId) {
        this.currentArticleId = articleId;
        this.showModal('commentModal');
    }

    // Rendering
    renderArticles() {
        const container = document.getElementById('articlesContainer');
        container.innerHTML = '';

        this.articles.forEach(article => {
            const articleElement = this.createArticleElement(article);
            container.appendChild(articleElement);
        });
    }

    createArticleElement(article) {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'article fade-in';
        articleDiv.innerHTML = `
            <div class="article-header">
                <div class="article-meta">
                    <span class="article-author">${this.escapeHtml(article.author)}</span>
                    <span class="article-category">${this.getCategoryName(article.category)}</span>
                    <span class="article-date">${this.formatDate(article.date)}</span>
                </div>
            </div>
            
            <h3 class="article-title">${this.escapeHtml(article.title)}</h3>
            <p class="article-content">${this.escapeHtml(article.content)}</p>
            
            <div class="article-actions">
                <button class="action-btn ${article.liked ? 'liked' : ''}" onclick="app.toggleLike('${article.id}')">
                    <i class="fas fa-heart"></i>
                    <span>${article.likes}</span>
                </button>
                <button class="action-btn" onclick="app.showComments('${article.id}')">
                    <i class="fas fa-comment"></i>
                    <span>${article.comments.length}</span>
                </button>
            </div>
            
            ${article.comments.length > 0 ? this.renderComments(article.comments) : ''}
        `;

        return articleDiv;
    }

    renderComments(comments) {
        return `
            <div class="comments-section">
                <div class="comments-header">
                    <h4 class="comments-title">Kommentit (${comments.length})</h4>
                </div>
                ${comments.map(comment => `
                    <div class="comment">
                        <div class="comment-header">
                            <span class="comment-author">${this.escapeHtml(comment.author)}</span>
                            <span class="comment-date">${this.formatDate(comment.date)}</span>
                        </div>
                        <p class="comment-content">${this.escapeHtml(comment.content)}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Navigation and filtering
    handleNavigation(section) {
        // Update active nav button
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        // Handle different sections
        switch (section) {
            case 'trending':
                this.sortArticles('popular');
                break;
            case 'latest':
                this.sortArticles('latest');
                break;
            default:
                this.renderArticles();
        }
    }

    filterByCategory(category) {
        // Update active category
        document.querySelectorAll('.category-link').forEach(link => {
            link.classList.remove('active');
        });
        event.target.classList.add('active');

        if (category === 'all') {
            this.renderArticles();
        } else {
            const filteredArticles = this.articles.filter(article => article.category === category);
            this.renderFilteredArticles(filteredArticles);
        }
    }

    renderFilteredArticles(articles) {
        const container = document.getElementById('articlesContainer');
        container.innerHTML = '';

        if (articles.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Ei artikkeleita tässä kategoriassa.</p>';
            return;
        }

        articles.forEach(article => {
            const articleElement = this.createArticleElement(article);
            container.appendChild(articleElement);
        });
    }

    sortArticles(sortBy) {
        let sortedArticles = [...this.articles];

        switch (sortBy) {
            case 'latest':
                sortedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'popular':
                sortedArticles.sort((a, b) => b.likes - a.likes);
                break;
            case 'comments':
                sortedArticles.sort((a, b) => b.comments.length - a.comments.length);
                break;
        }

        this.renderFilteredArticles(sortedArticles);
    }

    // Utility functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            return 'Juuri nyt';
        } else if (diffInHours < 24) {
            return `${diffInHours} tuntia sitten`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} päivää sitten`;
        }
    }

    getCategoryName(category) {
        const categories = {
            'general': 'Yleinen',
            'education': 'Koulutus',
            'local': 'Pirkanmaa',
            'culture': 'Kulttuuri',
            'sports': 'Urheilu',

        };
        return categories[category] || 'Yleinen';
    }

    // Storage
    saveArticles() {
        localStorage.setItem('sponssiSocialArticles', JSON.stringify(this.articles));
    }

    loadArticles() {
        const saved = localStorage.getItem('sponssiSocialArticles');
        return saved ? JSON.parse(saved) : [];
    }

    // Sample data
    addSampleData() {
        if (this.articles.length === 0) {
            const sampleArticles = [
                {
                    id: '1',
                    author: 'Sponssi Social Tiimi',
                    title: 'Tervetuloa Sponssi Socialiin - uuteen nuorten some-alustaan',
                    category: 'general',
                    content: 'Hei! Tervetuloa Sponssi Socialiin, uuteen sosiaalisen median alustaan joka on suunniteltu erityisesti Pirkanmaan nuorille. Täällä voit jakaa uutisia, keskustella lukioaiheista ja pysyä ajan tasalla paikallisista tapahtumista. Aloita julkaisemalla oma artikkelisi tai kommentoimalla muiden julkaisuja. Toivomme että viihdyt täällä!',
                    date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                    likes: 0,
                    comments: [],
                    liked: false
                }
            ];

            this.articles = sampleArticles;
            this.saveArticles();
        }
    }

    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            background-color: ${type === 'success' ? 'var(--success-color)' : 'var(--accent-color)'};
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the application
const app = new SponssiSocial();

// Helper: export current articles to JSON for GitHub commit workflow
window.exportSponssiArticles = () => {
    const data = {
        articles: app.articles
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'posts.json';
    a.click();
    URL.revokeObjectURL(url);
};
