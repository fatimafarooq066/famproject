<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <title>FAM Fashion – AI Virtual Try-On</title>
    <meta name="description" content="Try on makeup products virtually using AI face detection. Browse lipsticks, eyeshadows, blush, and foundation from top brands." />

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

    <!-- App CSS -->
    <link rel="stylesheet" href="{{ asset('css/fam-fashion.css') }}" />
<<<<<<< HEAD
    <link rel="stylesheet" href="{{ asset('css/fam-chat.css') }}" />
=======
>>>>>>> fa82c8a55c1bfea9cbf43c4f4996f1189704b607

    @stack('head')
</head>
<body>
    @yield('content')

<<<<<<< HEAD
    @include('partials.chat-widget')

    <!-- MediaPipe (browser-only, must stay in JS) -->
    <script type="module" src="{{ asset('js/fam-fashion.js') }}"></script>
    <script src="{{ asset('js/fam-chat.js') }}"></script>
=======
    <!-- MediaPipe (browser-only, must stay in JS) -->
    <script type="module" src="{{ asset('js/fam-fashion.js') }}"></script>
>>>>>>> fa82c8a55c1bfea9cbf43c4f4996f1189704b607

    @stack('scripts')
</body>
</html>
