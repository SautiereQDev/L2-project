<?php

namespace App;

use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;

class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    public function boot(): void
    {
        parent::boot();
        // Ensure the VichUploader upload directory exists
        $uploadDir = $this->getProjectDir() . '/public/uploads/athlete/profile';
        if (!is_dir($uploadDir)) {
            @mkdir($uploadDir, 0755, true);
        }
    }
}
