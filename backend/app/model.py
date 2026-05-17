import torch
import torch.nn as nn
from torchvision import models


# ---------------- CHANNEL ATTENTION ---------------- #

class ChannelAttention(nn.Module):
    def __init__(self, in_channels, reduction=16):
        super().__init__()

        self.avg_pool = nn.AdaptiveAvgPool2d(1)
        self.max_pool = nn.AdaptiveMaxPool2d(1)

        self.mlp = nn.Sequential(
            nn.Conv2d(in_channels, in_channels // reduction, 1, bias=False),
            nn.ReLU(),
            nn.Conv2d(in_channels // reduction, in_channels, 1, bias=False)
        )

        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        avg = self.mlp(self.avg_pool(x))
        mx = self.mlp(self.max_pool(x))

        return self.sigmoid(avg + mx)


# ---------------- SPATIAL ATTENTION ---------------- #

class SpatialAttention(nn.Module):
    def __init__(self, kernel_size=7):
        super().__init__()

        self.conv = nn.Conv2d(
            2,
            1,
            kernel_size,
            padding=kernel_size // 2,
            bias=False
        )

        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        avg = torch.mean(x, dim=1, keepdim=True)
        mx, _ = torch.max(x, dim=1, keepdim=True)

        x = torch.cat([avg, mx], dim=1)

        return self.sigmoid(self.conv(x))


# ---------------- CBAM ---------------- #

class CBAM(nn.Module):
    def __init__(self, channels):
        super().__init__()

        self.ca = ChannelAttention(channels)
        self.sa = SpatialAttention()

    def forward(self, x):
        x = self.ca(x) * x
        x = self.sa(x) * x

        return x


# ---------------- EFFICIENTNET + CBAM ---------------- #

class EfficientNetCBAM(nn.Module):
    def __init__(self, num_classes=5):
        super().__init__()

        self.backbone = models.efficientnet_b0(
            weights="IMAGENET1K_V1"
        )

        self.cbam = CBAM(1280)

        in_features = self.backbone.classifier[1].in_features

        self.backbone.classifier[1] = nn.Linear(
            in_features,
            num_classes
        )

    def forward(self, x):
        x = self.backbone.features(x)

        x = self.cbam(x)

        x = self.backbone.avgpool(x)

        x = torch.flatten(x, 1)

        x = self.backbone.classifier(x)

        return x


# ---------------- CREATE MODEL ---------------- #

def create_model(num_classes=5):
    return EfficientNetCBAM(num_classes=num_classes)