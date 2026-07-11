// lib/icons.tsx — barrel re-export (workaround for lucide-react type lag)
// Uses namespace import to avoid TS errors on individual named imports,
// then casts each to a uniform Icon type.

import * as Lucide from "lucide-react";
import type { ComponentType } from "react";

type Icon = ComponentType<{ className?: string; size?: number }>;

const wrap = (c: unknown) => c as Icon;

const names = [
  "LayoutDashboard", "Package", "Tags", "ShoppingCart", "Users", "Store", "Truck",
  "Ticket", "MapPin", "BarChart3", "FileText", "Settings", "UserCog", "Bell",
  "Menu", "X", "LogOut", "ChevronLeft", "ChevronRight", "ArrowRight", "ArrowLeft",
  "Save", "Copy", "Trash2", "Plus", "Minus", "Search", "Star", "Heart",
  "PawPrint", "Phone", "Mail", "Clock", "Navigation", "PhoneCall", "Lock",
  "Loader2", "Image", "CreditCard", "Home", "Building", "Edit", "Check",
  "AlertTriangle", "TrendingUp", "TrendingDown", "DollarSign", "ShoppingBag",
  "House", "Grid3x3", "User", "Globe", "Facebook", "Send", "Instagram",
  "List", "SlidersHorizontal", "Filter", "Calendar", "Shield", "MessageCircle",
  "Download", "Upload", "Eye", "EyeOff", "GripVertical",
  "ChevronDown", "ChevronUp", "Info", "AlertCircle",
] as const;

export const {
  LayoutDashboard, Package, Tags, ShoppingCart, Users, Store, Truck,
  Ticket, MapPin, BarChart3, FileText, Settings, UserCog, Bell,
  Menu, X, LogOut, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft,
  Save, Copy, Trash2, Plus, Minus, Search, Star, Heart,
  PawPrint, Phone, Mail, Clock, Navigation, PhoneCall, Lock,
  Loader2, Image, CreditCard, Home, Building, Edit, Check,
  AlertTriangle, TrendingUp, TrendingDown, DollarSign, ShoppingBag,
  House, Grid3x3, User, Globe, Facebook, Send, Instagram,
  List, SlidersHorizontal, Filter, Calendar, Shield, MessageCircle,
  Download, Upload, Eye, EyeOff, GripVertical, ChevronDown, ChevronUp, Info, AlertCircle,
} = Object.fromEntries(
  names.map((n) => [n, wrap((Lucide as unknown as Record<string, unknown>)[n])])
) as Record<(typeof names)[number], Icon>;
