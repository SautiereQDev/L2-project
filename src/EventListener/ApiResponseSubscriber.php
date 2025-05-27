<?php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use ApiPlatform\State\Pagination\PaginatorInterface;
use ApiPlatform\Symfony\EventListener\EventPriorities;

class ApiResponseSubscriber implements EventSubscriberInterface
{
    private NormalizerInterface $normalizer;

    public function __construct(NormalizerInterface $normalizer)
    {
        $this->normalizer = $normalizer;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['onKernelView', EventPriorities::PRE_SERIALIZE],
        ];
    }

    /**
     * @throws ExceptionInterface
     */
    public function onKernelView(ViewEvent $event): void
    {
        $request = $event->getRequest();
        if (0 !== strpos($request->getRequestUri(), '/api')) {
            return;
        }

        $controllerResult = $event->getControllerResult();
        $statusCode = JsonResponse::HTTP_OK;

        $response = $event->getResponse();
        if ($response instanceof JsonResponse) {
            $statusCode = $response->getStatusCode();
        }

        $data = [];
        if ($controllerResult instanceof PaginatorInterface) {
            $items = [];
            foreach ($controllerResult as $item) {
                $items[] = $this->normalizer->normalize(
                    $item,
                    'json',
                    $request->attributes->get('_api_normalization_context', [])
                );
            }
            $data['items'] = $items;
            $data['total'] = $controllerResult->getTotalItems();
        } else {
            $data = $this->normalizer->normalize(
                $controllerResult,
                'json',
                $request->attributes->get('_api_normalization_context', [])
            );
        }

        $wrapper = [
            'success' => true,
            'code'    => $statusCode,
            'message' => 'OK',
            'data'    => $data,
            'errors'  => null,
        ];

        $event->setResponse(new JsonResponse($wrapper, $statusCode));
    }
}
