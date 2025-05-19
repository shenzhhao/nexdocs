请将您的背景视频文件命名为 "background.mp4" 并放置在此目录中。

视频建议：
1. 选择简洁、抽象的视频，不要太过复杂或分散注意力
2. 视频分辨率建议至少为 1920x1080
3. 视频长度建议在 10-30 秒之间，并且可以无缝循环
4. 确保视频文件大小适中，建议不超过 10MB，以避免影响页面加载速度

支持的视频格式：
- MP4 (推荐)
- WebM
- Ogg

如果您想支持多种浏览器，可以在 LandingPage.jsx 文件中添加多个 source 标签，例如：

<video autoPlay loop muted playsInline>
  <source src="/videos/background.mp4" type="video/mp4" />
  <source src="/videos/background.webm" type="video/webm" />
  您的浏览器不支持视频标签
</video>