<?php

namespace App\Dto;

class ApiResponse
{
    private bool $success;
    private mixed $data;
    private ?string $message;
    private array $meta;

    public function __construct(
        bool $success = true,
        mixed $data = null,
        ?string $message = null,
        array $meta = []
    ) {
        $this->success = $success;
        $this->data = $data;
        $this->message = $message;
        $this->meta = $meta;
    }

    public function isSuccess(): bool
    {
        return $this->success;
    }

    public function getData(): mixed
    {
        return $this->data;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function getMeta(): array
    {
        return $this->meta;
    }

    public function toArray(): array
    {
        $result = [
            'success' => $this->success,
        ];

        if ($this->data !== null) {
            $result['data'] = $this->data;
        }

        if ($this->message !== null) {
            $result['message'] = $this->message;
        }

        if (!empty($this->meta)) {
            $result['meta'] = $this->meta;
        }

        return $result;
    }

    public static function success(mixed $data = null, ?string $message = null, array $meta = []): self
    {
        return new self(true, $data, $message, $meta);
    }

    public static function error(?string $message = 'Une erreur est survenue', mixed $data = null, array $meta = []): self
    {
        return new self(false, $data, $message, $meta);
    }
}
