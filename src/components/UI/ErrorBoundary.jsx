import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // 這裡可以加入錯誤記錄服務
    console.error('錯誤邊界捕獲到錯誤：', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container" style={{
          padding: '20px',
          margin: '20px',
          border: '1px solid #ff0000',
          borderRadius: '8px',
          backgroundColor: '#fff5f5'
        }}>
          <h2 style={{ color: '#cc0000' }}>很抱歉，發生了一些問題</h2>
          <p style={{ color: '#666666' }}>請重新整理頁面或聯繫系統管理員</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#cc0000',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            重新整理頁面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 